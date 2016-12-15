{
   "createdBy": "{{title}} {{firstName}} {{lastName}}",
   "createdDate": "{{ dateNow 'MM-DD-YY'}}",
   "createdTime": "{{ timeNow }}",
   "details":
   [
   {{#forEach myArray}}
      { 
         "date": "{{ date '2016' '2017' 'D MMM YYYY'}}",
         "sample": "{{sample}}",
         "foo": "{{foo}}",
         "value": "{{@value}}"
      }
   {{/forEach}}
   ]
}