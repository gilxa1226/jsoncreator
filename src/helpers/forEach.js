/**
 * Similar to handlebars #each, but includes commas for all but the last item
 * Implementation drawn from dummy-json #repeat
 * Usage:
 * {{forEach [array | string for mockData array]}}
 *   <Content here, with {{@value}} representing array items>
 * {{/forEach}}
 *
 * Other variables:
 * @index: current array index
 * @total: array length
 * @first: boolean, true if first item
 * @last: boolean, true if last item
 */

var Handlebars = require('handlebars');
var os = require('os');

exports.helper = helper;

function helper(arrayInput, options) {
	var ret = '';
	var arrayData;
	var total;
	var data;
	var i;

	if (arguments.length === 2) {
		// If input is an array, then we can use that
		if (Array.isArray(arrayInput)) {
			arrayData = arrayInput;
			total = arrayData.length;
		} else {
			throw new Error('The forEach helper requires an array or mock data param');
		}
	} else {
		throw new Error('The forEach helper requires an array or mock data param');
	}

	// Create a shallow copy of data so we can add variables without modifying the original
	data = Handlebars.Utils.extend({}, options.data);

	for (i = 0; i < total; i++) {
		// Clear the linked values on each iteration so a new set of names/companies is generated
		options.data.root.__cache = {};

		// You can access these in your template using @index, @total, @first, @last
		data.index = i;
		data.value = arrayData[i];
		data.total = total;
		data.first = i === 0;
		data.last = i === total - 1;

		// By using 'this' as the context the repeat block will inherit the current scope
		ret = ret + options.fn(this, { data: data });

		if (options.hash.comma !== false) {
			// Trim any whitespace left by handlebars and add a comma if it doesn't already exist,
			// also trim any trailing commas that might be at the end of the loop
			ret = ret.trimRight();
			if (i < total - 1 && ret.charAt(ret.length - 1) !== ',') {
				ret += ',';
			} else if (i === total - 1 && ret.charAt(ret.length - 1) === ',') {
				ret = ret.slice(0, -1);
			}
			ret += os.EOL;
		}
	}

	return ret;
} 
