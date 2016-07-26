const $ = require('jquery');
//const handlebars = require('handlebars');
const dummyJson = require('dummy-json');
const validator = require('json-validator');

const templateJson = $('.template-json');
const renderedJson = $('#codespace');

const genButton = $('#generate');
const curdate = new Date();

if (!library)
   var library = {};

library.json = {
   replacer: function(match, pIndent, pKey, pVal, pEnd) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] === '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
      },
   prettyPrint: function(obj) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/\\n/g, "")
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, library.json.replacer);
      }
   };

var data = {
    title: "\"Sample Title\"",  
    date: curdate.getDate() + "/" + (curdate.getMonth()+1) + "/" + curdate.getFullYear()
};

genButton.on('click', function () {
    var content = templateJson.val();
    //content = '<pre>' + JSON.stringify(content) + '</pre>';
    renderTemplateToJson(content);
});

function renderTemplateToJson(tempJson) {
    //var template = handlebars.compile(tempJson);
    var html = JSON.parse(dummyJson.parse(tempJson));
    renderedJson.html(library.json.prettyPrint(html));
}