// Similar to the built-in date helper, but uses the current date
// Usage: {{dateNow [format]}}

var dummyJson = require('dummy-json');

exports.helper = helper;

function helper(format, options) {
	var nowString = (new Date()).toLocaleString();

    return dummyJson.helpers.date(nowString, nowString, format, options);
}