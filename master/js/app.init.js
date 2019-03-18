/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */

if (typeof $ === 'undefined') {
   throw new Error('This application\'s JavaScript requires jQuery');
}

// APP START
// -----------------------------------

var App = angular.module('angle', [
   'ngRoute',
   'ngAnimate',
   'ngStorage',
   'ngCookies',
   'pascalprecht.translate',
   'ui.bootstrap',
   'ui.router',
   'oc.lazyLoad',
   'cfp.loadingBar',
   'ngSanitize',
   'ngResource',
   'tmh.dynamicLocale',
   'ngMockE2E',
   'ui.utils',
   'flash',
   'btorfs.multiselect',
   'myApp.config'

]);

App.constant('config', {
   apiMCF: "MCF_backend/",
   // serverUrl: "http://localhost:8080/"
   // new to change on the fly
   serverUrl: "http://localhost:8080/"
});

App.run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache',
   '$httpBackend', '$cookies', 'MockDatasourceFactoryService', 'AuthService', 'EnvironmentConfig',
   function($rootScope, $state, $stateParams, $window, $templateCache,
      $httpBackend, $cookies, MockDatasourceFactoryService, AuthService, EnvironmentConfig) {
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      /*
      $rootScope.$on("$stateChangeError", function(event, toState, toParams,
         fromState, fromParams, error) {
         if (error == AuthService.UNAUTHORIZED) {
            $state.go("page.login");
         } else if (error == AuthService.FORBIDDEN) {
            $state.go("page.forbidden");
         }
      });
      */

      Date.prototype.addDays = function(days) {
         var dat = new Date(this.valueOf())

         var hour1 = dat.getHours()
         dat.setTime(dat.getTime() + days * 86400000) // 24*60*60*1000 = 24 hours
         var hour2 = dat.getHours()

         if (hour1 != hour2) // summertime occured +/- a WHOLE number of hours thank god!
            dat.setTime(dat.getTime() + (hour1 - hour2) * 3600000) // 60*60*1000 = 1 hour

         return dat
      }

      Date.prototype.minusDays = function(days) {
         var date = new Date(this.valueOf());
         date.setDate(date.getDate() - days);
         return date;
      }

      $rootScope.db = new Dexie("mcf_database");

      $rootScope.db.version(1).stores({
         // mcfdatastore: '++id,typedb,data',
         emailstore: '&assignmentId, data',
         mcftrans: '++id,transdate,drivername,typedb,data',
      });


      $rootScope.db.open();


      /*
            $rootScope.data01 = {
               "formType": 1,
               "pathoWasteWtInPounds": 0,
               "customerNumber": "450-1087",
               "other2ContainerQty": 0,
               "customerCity": "ATLANTA",
               "customerEmail": "dmdricardo@bellsouth.net",
               "processedDate": "2018-07-10 20:41:52.538",
               "other3WtInPounds": 0,
               "pathoWasteContainerQty": 0,
               "bioMediContainerQty": 1,
               "bioMediWtInPounds": 0,
               "other1Item": null,
               "customerZip": "30329",
               "customerState": "GA",
               "traceChemoContainerQty": 0,
               "shipperSign": "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bFPTYmukovUDPsbINlLY1tf0sTFKWHZeBJ4hzcVbNXqw2Bgn5i0SdpUwFcH8m22jpjHQdNXOJ4otcFXbRfGilKkjH5VCZYNo1ZPvKhsrpcCtEor8rLMdPxaYuuhSvF91bRd9zOVtdRWwHAnMhUCdgQwnIgaoOyW8RwKuwmLkJVL4SAn4GEnZQOdPeOSvklBH/EMWr+vqOkqWymwv8UckfEFC6NbW6y7L46HidyX0Ld5H/6PyL+Jg2R2BrX98342hfRIYKoGjxTF7sgwh/ac1YB1aw+/DSvRgbhJX4Snbiyu5Or6XuJVl10cTtfPzWbyjUhKYGIGPSXtSDix1dWEO7yIJD63BE/PJ+Ip+mW5c/donzG+VfNtbc28PNvAQ7DESxiKxdwW+zaeNpaH0kwSGRuB14hAeilUNXv6kC+VxBYiHR03ekjlD6oV0drENT/uPk/BACWOXHaUBTZhhhUHOFQ9j50r/SaAxAQwsmAe9UgLm2XDFowH5KyTsJSGVNBkAmtbBHGmbdZip2pxLD1ZLVF2hggHmUCkkQAITI9B0YKxbL2bN6sTQsjkkQAJzIvABaWzdgbGsHK7IbpPw4jnBY1tJgARIIERgP9mIxfF4Awy3owh4go71weskYElTzpcdRD2FBEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEhgOYH/BxjNR60CohK5AAAAAElFTkSuQmCC",
               "traceChemoWtInPounds": 0,
               "driverName": "TOLSON",
               "customerName": "RICARDO MONTES DE OCA,DMD PC",
               "other1WtInPounds": 0,
               "other1ContainerQty": 0,
               "other3ContainerQty": 0,
               "shipperSignDate": "2018-07-10 20:41:52.538",
               "transporterSignDate": "2017-08-10 20:41:52.538",
               "assignmentId": 580235,
               "route": "atlanta",
               "customerAddress": "3369 BUFORD HWY STE 840",
               "other3Item": null,
               "monthlyBill": "kloo",
               "other2WtInPounds": 0,
               "other2Item": null
            }
      */


      $rootScope.pushTransMCF = function(assign) {
         $rootScope.db.mcftrans.put(assign);
      };



      /*
            $rootScope.$on('$stateChangeStart', function($event, next, current) {

               $rootScope.counter = $rootScope.db.friends.count().then(function(result) {
                  $rootScope.counter = result;
                  // This code is called if resolve() was called in the Promise constructor
               })

               if ($rootScope.counter > 0) {
                  alert("Unload Database");

                  if (!$rootScope.eventSource) {
                     $rootScope.eventSource = new EventSource("http://localhost:8080/MCF_backend/heartBeat", {
                        withCredentials: true
                     });
                  } else if ($rootScope.eventSource.readyState == 2) {
                     $rootScope.eventSource = new EventSource("http://localhost:8080/MCF_backend/heartBeat", {
                        withCredentials: true
                     });
                  }

                  $rootScope.eventSource.onmessage = function(event) {
                     console.log("HeartBeat-" + event.data);
                  };


               }
            });

            */



      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Scope Globals
      // -----------------------------------
      $rootScope.app = {
         // name: 'MCF',
         //description: 'MCF a waste management system',
         version: ((new Date()).getTime()),
         name: 'MCF Online',
         //backendURL: "http://localhost:8090/",
         description: 'MCF Customer Portal',
         year: ((new Date()).getFullYear()),
         layout: {
            isFixed: true,
            isCollapsed: false,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null
         },
         useFullLayout: false,
         hiddenFooter: false,
         offsidebarOpen: false,
         asideToggled: false,
         viewAnimation: 'ng-fadeInUp'
      };

      $rootScope.user = {
         name: 'John',
         job: 'ng-developer',
         picture: 'app/img/user/02.jpg'
      };



      //$rootScope.apiMCF = ""
      // OR
      $rootScope.apiMCF = "MCF_backend/";
      $rootScope.EnvironmentConfig = EnvironmentConfig;

      console.log('EnvironmentConfig==>' + EnvironmentConfig.serverUrl);

      //$rootScope.serverUrl = "http://mcf.weemsdesignstudio.com\:8080/"
      $rootScope.serverUrl = EnvironmentConfig.serverUrl;
      /*
            $rootScope.imgServerUrl = EnvironmentConfig.serverUrl+'MCF_backend/opt/userSignImgs/'; // grails 2.4.4 version path
      	  */
      /* grails 3.2 version path*/
      $rootScope.imgServerUrl = EnvironmentConfig.serverUrl + 'MCF_backend/imageDisplay/displayImage';

      /*
      // Added new whenPost just for login
      $httpBackend.whenPOST(/.*\/login*./).respond(function(method, url, data) {
        console.log("fake login... " + url);
          var params = angular.fromJson(data);
          console.log("params:" + params);
          var users =  MockDatasourceFactoryService.getAllData("login");
      	  var response = {validUser:false};
          // MockDatasourceFactoryService.showAll(urlArray[4]);
          for(var i = 0; i < users.length; i++)
          {
            console.log("params.pwd: " + params.pwd + " and users[" + i + "].password: " + users[i].password );
            console.log("params.user: " + params.user + " and users[" + i + "].email: " + users[i].email );
            if((users[i].email == params.user) && (users[i].password == params.pwd))
            {
              response.validUser=true;
              angular.extend(response,users[i]);
              break;
            }
          }
              return  [204, response];
      });

      */


      $httpBackend.whenGET(/.*\/apiMCF\/.*/).respond(function(method, url,
         data) {
         //alert("get");

         console.log("fake Retrieving... " + url);
         var urlArray = url.split('/');
         for (var i = 0; i < urlArray.length; i++) {
            console.log(i + ": " + urlArray[i])
         }

         return [201, MockDatasourceFactoryService.getAllData(urlArray[4]), {}];
      });



      $httpBackend.whenDELETE(/.*\/apiMCF\/.*\/\d+$/).respond(function(
         method, url, data) {
         console.log("fake deleting... " + url);
         // parse the matching URL to pull out the id (/games/:id)
         var urlArray = url.split('/');
         for (var i = 0; i < urlArray.length; i++) {
            console.log(i + ": " + urlArray[i])
         }

         MockDatasourceFactoryService.deleteOne(id, urlArray[4]);
         return [204, {}, {}];
      });



      // this is the creation of a new resource
      $httpBackend.whenPOST(/.*\/apiMCF\/.*/).respond(function(method, url,
         data) {

         console.log("fake adding... " + url);
         var urlArray = url.split('/');
         for (var i = 0; i < urlArray.length; i++) {
            console.log(i + ": " + urlArray[i]);
         }

         var params = angular.fromJson(data);

         var response = {
            validUser: false
         };


         if (urlArray[4] == "registerlog") {
            var domainObject = MockDatasourceFactoryService.addOne(params,
               urlArray[4]);
            MockDatasourceFactoryService.showAll(urlArray[4]);
            return [201, {}, {}];

         }

         if (urlArray[4] == "recoverlog") {
            var domainObject = MockDatasourceFactoryService.addOne(params,
               urlArray[4]);
            MockDatasourceFactoryService.showAll(urlArray[4]);
            return [204, {}, {}];

         }

      });


      $httpBackend.whenPUT(/.*\/apiMCF\/.*\/\d+$/).respond(function(method,
         url, data) {

         // alert("put");
         // parse the matching URL to pull out the id (/games/:id)
         console.log("fake Updating... " + url);
         var id = url.split('/')[5];

         var urlArray = url.split('/');
         for (var i = 0; i < urlArray.length; i++) {
            console.log(i + ": " + urlArray[i]);
         }

         console.log("Updating user[" + id + "]: " + data);
         // alert("data from whenPut fake update: " + data);
         MockDatasourceFactoryService.updateOne(id, JSON.parse(data),
            urlArray[4]);
         MockDatasourceFactoryService.showAll(urlArray[4]);
         return [204, {}, {}];
      });



      // pass trough all GET requests to api/backend and so on, that havent been catched
      // in another $httpBackend.whenGET rule
      $httpBackend.whenGET().passThrough();

      // $httpBackend.whenPOST(/.*\/auth\/.*/).passThrough();

      $httpBackend.whenPOST().passThrough();
      $httpBackend.whenPUT().passThrough();

      $httpBackend.whenDELETE().passThrough();

   }
]);
