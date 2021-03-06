const $ = require('jquery');
const dummyJson = require('dummy-json');
const validator = require('json-validator');
const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const dialog = remote.dialog;

const renderedJson = $('#codespace');
const genButton = $('#generate');
const openTemplateButton = $('#open-template-file');
const saveTemplateButton = $('#save-template-file');
const openMockDataButton = $('#open-mock-data-file');
const saveMockDataButton = $('#save-mock-data-file');

const curdate = new Date();
var currentWindow  = remote.getCurrentWindow();
var JavaScriptMode = ace.require('ace/mode/javascript').Mode;
var editorInstance = ace.edit('template-editor');
var mockDataInstance = ace.edit('mock-data-editor')
var helperFunctions = {};

editorInstance.setTheme('ace/theme/twilight');
editorInstance.session.setMode(new JavaScriptMode());

mockDataInstance.setTheme('ace/theme/twilight');
mockDataInstance.session.setMode(new JavaScriptMode());

loadHelpers();

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
    var content = editorInstance.getValue();
    var mockData = {};

    try {
        mockData = JSON.parse(mockDataInstance.getValue());
    } catch (err) {
        console.error('Error parsing mock data:', err);
        mockData = {};
    }
    renderTemplateToJson(content, mockData);
});

openTemplateButton.on('click', openHandler.bind(null,'template'));
saveTemplateButton.on('click', saveHandler.bind(null,'template'));
openMockDataButton.on('click', openHandler.bind(null,'mockData'));
saveMockDataButton.on('click', saveHandler.bind(null,'mockData'));

function renderTemplateToJson(tempJson, mockData) {
    var html = JSON.parse(dummyJson.parse(tempJson, {helpers: helperFunctions, mockdata: mockData}));
    renderedJson.html(library.json.prettyPrint(html));
}

function openHandler (editorString) {
    var fileNames = dialog.showOpenDialog(currentWindow);
    var editor = (editorString === 'mockData' ? mockDataInstance : editorInstance);

    if (fileNames !== undefined) {
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf8', function (err, data) {
            editor.setValue(data);
        });
    }
}

function saveHandler (editorString) {
    var fileName = dialog.showSaveDialog(currentWindow);
    var editor = (editorString === 'mockData' ? mockDataInstance : editorInstance);

    if (fileName !== undefined) {
        fs.writeFile(fileName, editor.getValue());
    }
}

function loadHelpers () {
    fs.readdirSync(path.join(__dirname,'helpers')).forEach(function requireFile(file)
	{
		helperFunctions[path.basename(file, '.js')] = require('./helpers/'+file).helper;
	});
}
