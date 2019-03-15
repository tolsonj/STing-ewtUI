//var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
exports.config = {
   seleniumAddress: 'http://localhost:4444/wd/hub',
   specs: ['spec_mcf_doc1.js', 'spec_mcf_med1.js'],
   // specs: ['spec_mcf_doc1.js'],
   capabilities: {
      browserName: 'chrome'
   }
   //  specs: ['spec.js', 'spec_mcf.js']
   /*  ,onPrepare: function() {
         jasmine.getEnv().addReporter(
           new Jasmine2HtmlReporter({
             savePath: './test/reports/',
   		  screenshotsFolder: 'images'
           })
         );
   	  }
     multiCapabilities: [{
       browserName: 'firefox'
     }, {
       browserName: 'chrome'
     }]
     ,capabilities: {
       browserName: 'firefox'
     } */
   // if dont put capabilities, protractor take chorome as default
};
