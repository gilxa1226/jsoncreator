// Similar to the built-in date helper, but uses the current date
// Usage: {{dateNow [format]}}

var dummyJson = require('dummy-json');

exports.helper = helper;

function helper(format, options) {
	var now = new Date();
	var nowString = now.toISOString().split('T')[1];

    return dummyJson.helpers.time(nowString, nowString, format, options);
}