/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
      '$httpProvider', 'RouteHelpersProvider', 'EnvironmentConfig',
      function($stateProvider, $locationProvider, $urlRouterProvider,
         $httpProvider, helper, EnvironmentConfig) {
         'use strict';



         // Set the following to true to enable the HTML5 Mode
         // You may have to set <base> tag in index and a routing configuration in your server
         $locationProvider.html5Mode(false);
         //var url    = document.location.toString().toLowerCase();
         var url = document.location.toString();
         var str = url;
         var lastSlash = str.lastIndexOf("/");
         var strtoken = str.substring(lastSlash + 1);
         //console.log(strtoken);

         var urltoken = '/#/page/register/' + strtoken;
         //console.log(urltoken);

         //var n = str.lastIndexOf("planet");
         // default route
         $urlRouterProvider.otherwise('app/uploadLargeFiles');
         /*
         var contacts = {
              url: '/register/EGPY6XJU7PJUKJ0P6DWT5KVEQF7WHKtest@gmail.com',
         		//url: tt,
                 title: "Register",
                 templateUrl: helper.basepath('register.html'),
         		resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'))

         }*/

         //http://127.0.0.1:8090/#/page/register/egpy6xju7pjukj0p6dwt5kveqf7whktest@gmail.com

         //
         // Application Routes
         // -----------------------------------
         $stateProvider
            .state('app', {
               url: '/app',
               abstract: true,
               templateUrl: helper.basepath('app.html'),
               //templateUrl: 'app/pages/page.html',
               controller: 'AppController',
               //resolve: helper.resolveFor('modernizr', 'icons','slimscroll','sparklines','classyloader')
               resolve: helper.resolveFor('fastclick', 'modernizr', 'icons',
                  'screenfull', 'animo', 'slimscroll', 'classyloader',
                  'toaster', 'whirl')
            })

         .state('app.useradmin', {
            url: '/user',
            title: "User",
            templateUrl: helper.basepath('custom/useradmin.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
               'ui.select'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'AdminController'
         })

         .state('app.customeradmin', {
               url: '/customeradmin',
               title: "Customer Admin",
               templateUrl: helper.basepath('customeradmin.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("CUSTOMERADMIN");
                  }],
               })
            })
            .state('app.profile', {
               url: '/profile',
               title: "Profile",
               templateUrl: helper.basepath('custom/profile.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'ProfileController'
            })
            .state('app.dispatchsnew', {
               url: '/dispatch',
               title: 'Dispatch',
               templateUrl: helper.basepath('custom/dispatch_new.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'OrderDispatchController'


            })
            .state('app.containers', {
               url: '/containers',
               title: 'Containers',
               templateUrl: helper.basepath('custom/containers.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'ContainerController'

            })
            .state('app.containersize', {
               url: '/containersize',
               title: 'ContainerSize',
               templateUrl: helper.basepath('custom/containersize.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'ContainerSizeController'

            })
            .state('app.customers', {
               url: '/customers',
               title: 'Customers',
               templateUrl: helper.basepath('custom/customers.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'CustomerController'

            })
            .state('app.orders', {
               url: '/orders',
               title: 'Orders',
               templateUrl: helper.basepath('custom/orders.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
                  'ui.select'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'OrderController'
            })
            .state('app.completedOrders', {
               url: '/completedOrders',
               title: 'Completed Orders',
               templateUrl: helper.basepath('custom/completed_orders.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'CompletedOrderController'

            })

         .state('app.vehicles', {
               url: '/vehicles',
               title: 'vehicles',
               templateUrl: helper.basepath('custom/vehicles.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'VehicleController'

            })
            .state('app.sites', {
               url: '/sites',
               title: 'Sites',
               templateUrl: helper.basepath('custom/sites.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
                  'ui.select'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'SiteController'
            })
            .state('app.landfills', {
               url: '/landfills',
               title: 'Landfills',
               templateUrl: helper.basepath('custom/landfills.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'LandfillController'

            })
            .state('app.drivers', {
               url: '/drivers',
               title: 'Drivers',
               templateUrl: helper.basepath('custom/drivers.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'DriverController'

            })
            .state('app.approval', {
               url: '/approval',
               title: 'Approval',
               templateUrl: helper.basepath('custom/approval.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'approvalController'

            })
            .state('app.useractivity', {
               url: '/useractivity',
               title: 'useractivity',
               templateUrl: helper.basepath('custom/UserActivity.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'useractivityController'
            })
            .state('app.maps', {
               url: '/maps',
               title: 'Maps',
               templateUrl: helper.basepath('custom/maps.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'MapCtrl'

            })
            .state('app.company', {
               url: '/company',
               title: 'Company',
               templateUrl: helper.basepath('custom/company.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'companyController'

            })
            .state('app.companyadmins', {
               url: '/companyadmins',
               title: 'CompanyAdmins',
               templateUrl: helper.basepath('custom/companyadmins.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'companyadminsController'
            })

         .state('app.browse', {
               url: '/browse',
               title: 'Browse',
               templateUrl: helper.basepath('custom/reconcile.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'reconcileController'

            })
            .state('app.exportbol', {
               url: '/exportbol',
               title: 'ExportBOL',
               templateUrl: helper.basepath('custom/exportBOL.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable', 'ui.select'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'exportBOLController'

            })
            .state('app.exportassignment', {
               url: '/exportassignment',
               title: 'ExportAssignment',
               templateUrl: helper.basepath('custom/exportAssignment.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable', 'ui.select'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'exportAssignmentController'

            })
            .state('app.invoicehistory', {
               url: '/history',
               title: 'History',
               templateUrl: helper.basepath('custom/invoice_history.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'invoicehistoryController'
            })

         .state('app.shopping', {
            url: '/shopping',
            title: 'Shopping',
            templateUrl: helper.basepath('custom/shopping.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'shoppingController'
         })

         .state('app.cartItem', {
            url: '/cartItem',
            title: 'cartItem',
            templateUrl: helper.basepath('custom/cartItem.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'cartController'
         })

         .state('app.product', {
               url: '/product',
               title: 'product',
               templateUrl: helper.basepath('custom/product.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'productController'
            })
            .state('app.payment', {
               url: '/payment',
               title: 'payment',
               templateUrl: helper.basepath('custom/payment.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'paymentController'
            })
            .state('app.purchaseHistory', {
               url: '/purchases',
               title: 'purchases',
               templateUrl: helper.basepath('custom/purchaseHistory.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'purchaseHistoryController'
            })

         .state('app.customerdetails', {
            url: '/customerdetails',
            title: 'Bol entry form',
            templateUrl: helper.basepath('custom/customerDetailsForm.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
               'ui.select'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'bolController'
         })

         .state('app.medical_bol', {
            url: '/medical_bol',
            title: 'Medical Bol',
            templateUrl: helper.basepath('custom/medicalBol.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
               'ui.select'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'bolController'
         })

         .state('app.destruction_bol', {
            url: '/destructionbol',
            title: 'Destruction Bol',
            templateUrl: helper.basepath('custom/destructionBol.html'),
            resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
               'ui.select'), {
               access: ["AuthService", function(AuthService) {
                  return AuthService.isAuthorized("ADMIN");
               }],
            }),
            controller: 'bolController'
         })

         .state('app.uploadLargeFiles', {
               url: '/uploadLargeFiles',
               title: "Upload Large Files",
               templateUrl: helper.basepath('custom/uploadLargeFiles.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
                  'ui.select', 'flow')),
               controller: 'uploadLargeFilesController'
            })
            .state('app.dashboard', {
               url: '/dashboard',
               title: "Dashboard",
               templateUrl: helper.basepath('custom/dashboard.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
                  'ui.select')),
               controller: 'dashboardController'
            })
            .state('app.bolhistory', {
               url: '/bolHistory',
               title: 'BOL History',
               templateUrl: helper.basepath('custom/bolHistory.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable',
                  'ui.select'), {
                  access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                  }],
               }),
               controller: 'bolController'
            })

         /* .state('app.destbol_list', {
                 url: '/destbol_list',
                 title: 'list Of BOL',
                 templateUrl: helper.basepath('custom/destbol_list.html'),
                 resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable','ui.select'), {
                   access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                   }],
                 }),
                 controller: 'bolController'
               })

         	  .state('app.medicalbol_list', {
                 url: '/medicalbol_list',
                 title: 'list Of BOL',
                 templateUrl: helper.basepath('custom/medicalbol_list.html'),
                 resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable','ui.select'), {
                   access: ["AuthService", function(AuthService) {
                     return AuthService.isAuthorized("ADMIN");
                   }],
                 }),
                 controller: 'bolController'
               }) */


         // Single Page Routes
         // -----------------------------------
         .state('page', {
               url: '/page',
               templateUrl: 'app/pages/page.html',
               resolve: helper.resolveFor('modernizr', 'icons'),
               controller: function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
               }
            })
            .state('page.login', {
               url: '/login',
               title: "Login",
               templateUrl: angular.extend(helper.basepath('login.html'))
            })
            .state('page.logout', {
               url: '/logout',
               title: "Logout",
               controller: function($state, $cookieStore, $cookies, $timeout, $interval, $rootScope) { //$cookieStore.remove('currentUser');

                  // Remove all cookies
                  angular.forEach($cookies, function(cookie, key) {
                     //console.log(key + ': ' + $cookies[key] + '\n');
                     $cookieStore.remove(key);

                  });


                  $state.go('app.dashboard');
                  localStorage.removeItem('assigned_customer_data');
                  localStorage.removeItem('customer_data');
                  localStorage.removeItem('token');
                  $interval.cancel($rootScope.oneTimer);

               }
            })



         .state('page.register', {
               //url: '/register/JE7A21AXV2A83NJIDQNYYCO2AFZDB8testone@gmail.com',
               url: '/register/:strtoken',
               title: "Register",
               templateUrl: helper.basepath('register.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable')),
               controller: 'registerUserController'

            })
            .state('page.company_register', {
               url: '/companyRegistration',
               title: "companyRegistration",
               templateUrl: helper.basepath('company_register.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable')),
               controller: 'companyRegisterController'
            })
            .state('page.resetpass', {
               url: '/resetpass/:strtoken',
               title: "resetpass",
               templateUrl: helper.basepath('resetpass.html'),
               resolve: angular.extend(helper.resolveFor('ngDialog', 'ngTable')),
               controller: 'SetNewPassowrdcontroller'
            })
            .state('page.recover', {
               url: '/recover',
               title: "Recover",
               templateUrl: helper.basepath('recover.html'),
               controller: 'PasswordRecoverController'
            })
            .state('page.lock', {
               url: '/lock',
               title: "Lock",
               templateUrl: helper.basepath('lock.html')
            })
            .state('page.404', {
               url: '/404',
               title: "Not Found",
               templateUrl: helper.basepath('404.html')
            })
            .state('page.forbidden', {
               url: '/forbidden',
               title: "Forbidden",
               templateUrl: helper.basepath('forbidden.html')
            })

         //
         // Horizontal layout
         // -----------------------------------
         /*    .state('app-h', {
                 url: '/app-h',
                 abstract: true,
                 templateUrl: helper.basepath( 'app-h.html' ),
                 controller: 'AppController',
                 resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
             })
             .state('app-h.dashboard_v2', {
                 url: '/dashboard_v2',
                 title: 'Dashboard v2',
                 templateUrl: helper.basepath('dashboard_v2.html'),
                 controller: function($rootScope, $scope) {
                     $rootScope.app.layout.horizontal = true;
                     $scope.$on('$destroy', function(){
                         $rootScope.app.layout.horizontal = false;
                     });
                 },
                 resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
             })
         */
         //

         //
         // CUSTOM RESOLVES
         //   Add your own resolves properties
         //   following this object extend
         //   method
         // -----------------------------------
         // .state('app.someroute', {
         //   url: '/some_url',
         //   templateUrl: 'path_to_template.html',
         //   controller: 'someController',
         //   resolve: angular.extend(
         //     helper.resolveFor(), {
         //     // YOUR RESOLVES GO HERE
         //     }
         //   )
         // })
         ;

         // http intereptor for 401

         $httpProvider.interceptors.push(['$q', '$location', 'EnvironmentConfig', function($q, $location,
            EnvironmentConfig) {
            return {


               request: function(config) {
                  // console.log(config.method);
                  // console.log(config.url);
                  if (config.method == 'GET' && config.url.indexOf('app/') != -1) {
                     var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                     config.url = config.url + separator + 'noCache=' + EnvironmentConfig.commit_date;
                  }

                  // prevent authorization cache in http request

                  config.headers['Authorization'] = '';

                  config.headers['Authorization'] = JSON.parse(localStorage.getItem('token'));


                  return config;
               },


               response: function(response) {
                  response.status === 200
                  return response || $q.when(response);
               },
               responseError: function(rejection) {
                  // Executed only when the XHR response
                  // has an error status code

                  //console.log('rejection error==>' + angular.toJson(rejection));
                  //console.log("rejection.status " + rejection.status);


                  if (rejection.status == 401 || rejection.status == -1) {

                     // The interceptor "blocks" the error;
                     // and the success callback will be executed.
                     localStorage.removeItem('token');
                     console.log('rejection error');
                     $location.path("#/page/logout");

                     // window.location.reload(true);


                     rejection.data = {
                        stauts: 401,
                        descr: 'unauthorized'
                     }
                     return rejection.data;
                  }

                  // $q.reject creates a promise that is resolved as
                  // rejected with the specified reason.
                  // In this case the error callback will be executed.

                  return $q.reject(rejection);
               }
            }
         }]);


      }
   ]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function(
      $ocLazyLoadProvider, APP_REQUIRES) {
      'use strict';

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
         debug: false,
         events: true,
         modules: APP_REQUIRES.modules
      });

   }])
   .config(['$controllerProvider', '$compileProvider', '$filterProvider',
      '$provide',
      function($controllerProvider, $compileProvider, $filterProvider, $provide) {
         'use strict';
         // registering components after bootstrap
         App.controller = $controllerProvider.register;
         App.directive = $compileProvider.directive;
         App.filter = $filterProvider.register;
         App.factory = $provide.factory;
         App.service = $provide.service;
         App.constant = $provide.constant;
         App.value = $provide.value;

      }
   ]).config(['$translateProvider', function($translateProvider) {

      $translateProvider.useStaticFilesLoader({
         prefix: 'app/i18n/',
         suffix: '.json'
      });
      $translateProvider.preferredLanguage('en');
      $translateProvider.useLocalStorage();
      $translateProvider.usePostCompiling(true);

   }]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.wrapper > section';
   }]).config(['$tooltipProvider', function($tooltipProvider) {

      $tooltipProvider.options({
         appendToBody: true
      });

   }]);
