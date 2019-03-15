App.factory('signService', function($resource, $rootScope) {
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "bol";
   // console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   // console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {
      query: {
         method: 'GET',
         isArray: false,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         }
      },
      get: {
         method: 'GET',
         isArray: false,
         url: $rootScope.serverUrl + 'MCF_backend/bol/4',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         }
      },
      getDriverList: {
         method: 'GET',
         isArray: false,
         url: $rootScope.serverUrl + 'MCF_backend/secUser?driversOnly=true',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         }
      },
      getAssignmentList: {
         method: 'POST',
         isArray: false,
         url: $rootScope.serverUrl + 'MCF_backend/assignment/allAssignment',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         }
      },
      saveSync: {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/bol/saveSync',
         params: {}
      },
      save: {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/bol',
         params: {}
      },
      saveImage: {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/bol/:id',
         params: {}
      },
      sendPdf: {
         method: 'POST',
         isArray: false,
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/Bol/sendBolAsPdfMail'
      },
      bolApproval: {
         method: 'POST',
         isArray: false,
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/Bol/approve'
      },
      bolPreview: {
         method: 'POST',
         isArray: false,
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/Bol/getPdfPreview',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/bol/:id',
         params: {
            id: '@_id'
         }
      },
      updateEmail: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/assignment/:id',
         params: {
            id: '@_id'
         }
      },
      destroy: {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/bol/:id',
         params: {
            id: '@_id'
         }
      }
   });
});

App.factory('onlineStatus', ["$window", "$rootScope", function($window, $rootScope) {
   var onlineStatus = {};

   onlineStatus.onLine = $window.navigator.onLine;

   onlineStatus.isOnline = function() {
      return onlineStatus.onLine;
   };

   $window.addEventListener("online", function() {
      onlineStatus.onLine = true;
      $rootScope.$digest();
   }, true);

   $window.addEventListener("offline", function() {
      onlineStatus.onLine = false;
      $rootScope.$digest();
   }, true);

   return onlineStatus;
}]);


App.controller('bolController', function($rootScope, $scope, $state, $window, $timeout,
   $filter, $cookieStore, ngTableParams, ngDialog, signService, Customer, onlineStatus, $location, $sce, $q, $interval) {

   $scope.userRole = false;
   $scope.username = $cookieStore.get('setUsername');
   var roles = $cookieStore.get('setRoles');
   if (roles.indexOf('ROLE_SYSTEM_ADMIN') > -1) {
      $scope.userRole = true;
      console.log("userRole: " + $scope.userRole);
   }

   $rootScope.pushEmail = function(email) {
      console.log(email.assignmentId);
      console.log(email.data);
      return $rootScope.db.emailstore.put(email);
   };


   $rootScope.deleteEmailRec = function(recId) {
      return $rootScope.db.emailstore.where('assignmentId').equals(recId).delete();
   };

   $rootScope.deleteAll = function() {
      var d = new Date();
      $rootScope.db.mcftrans.where('transdate').below(d.minusDays(7)).delete().then(function(deleteCount) {
         console.log("BOL Deleted " + deleteCount + " objects");
      }).catch(function(error) {
         console.log("error:" + error.message);
      });
      $rootScope.db.emailstore.where('assignmentId').above(0).delete().then(function(deleteCount) {
         console.log("Email Deleted " + deleteCount + " objects");
      }).catch(function(error) {
         console.log("error:" + error.message);
      });
   };


   $rootScope.getIndexDBData = function() {
      return $rootScope.db.mcftrans.where('id').above(0).toArray();
   };
   // console.log("heartbeat server==>" + $scope.serverUrl + "MCF_backend/heartBeat");

   $rootScope.offlineCount = 0;
   $rootScope.offlineEmailCount = 0;


   function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
   }

   // ********************************* TODO Add to server or local storage for assignment *********************************

   $scope.assigned_customer = Customer.AssignmentQuery(function(res) {
      localStorage.setItem('assigned_customer_data', JSON.stringify(res));

   }, function(error) {
      $scope.failShowGet = true;
      $scope.assigned_customer = JSON.parse(localStorage.getItem(
         'assigned_customer_data'));
   });


   var SECOND = 1000; // PRIVATE
   var MINUTE = SECOND * 60;
   var HOUR = MINUTE * 60;
   var DAY = HOUR * 24;


   $rootScope.sycDataToServer = function() {
      var d = new Date();
      // console.log("Delete below: " + d.minusDays(7));
      $rootScope.db.mcftrans.where('transdate').below(d.minusDays(7)).delete().then(function(data) {
         console.log("BOL Deleted " + data + " objects");
      }).catch(function(error) {
         console.log("error:" + error.message);
      }).then(function() {
         $scope.assigned_customer = Customer.AssignmentQuery(function(res) {
            localStorage.setItem('assigned_customer_data', JSON.stringify(res));

            $rootScope.getIndexDBData().then(function(data) {
               var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

               for (i = 0; i < data.length; i++) {
                  // console.log(listData[i]);
                  var signServiceObj = new signService();
                  var localStorageSignServiceObj = JSON.parse(data[i].data)
                     // console.log("1) signServiceObj.guid:" + guid + "- localStorageSignServiceObj.customerNumber: " + localStorageSignServiceObj.customerNumber);
                  signServiceObj.guid = guid;
                  signServiceObj.typedb = data[i].typedb;
                  signServiceObj.transdate = data[i].transdate;
                  signServiceObj.drivername = data[i].drivername;
                  signServiceObj.id = data[i].id;
                  signServiceObj.data = data[i].data;



                  var formType = 2
                  for (var x = 0; x < $scope.assigned_customer.length; x++) {
                     if ($scope.assigned_customer[x].bolType == 'Medical') {
                        formType = 1
                     }

                     if (localStorageSignServiceObj.formType == formType && $scope.assigned_customer[x].customerNumber == localStorageSignServiceObj.customerNumber) {
                        $scope.assigned_customer[x]['processed'] = true;
                     }
                  }
                  // console.log("2) signServiceObj.guid:" + guid + "- localStorageSignServiceObj.customerNumber: " + localStorageSignServiceObj.customerNumber);
                  signServiceObj.$saveSync(function(resp, headers) {});
               }
               localStorage.setItem('assigned_customer_data', JSON.stringify($scope.assigned_customer));
            });


         }, function(error) {
            $scope.failShowGet = true;
            $scope.assigned_customer = JSON.parse(localStorage.getItem(
               'assigned_customer_data'));
         });
      }).then(function(value) {

      });



   };


   // console.log("Calling Assignment Query");
   if ($location.path() == '/app/customerdetails') {
      $rootScope.sycDataToServer();
   }


   $scope.bolType = [{
      'id': 1,
      'type': 'Medical'
   }, {
      'id': 2,
      'type': 'Document'
   }];
   $scope.BolDet = {};
   $scope.customerForm = {};
   $scope.customerForm.show = true;

   $scope.BolDet.bolType = null;

   // set current week filters date
   $scope.fromDate = ($filter('date')(new Date(moment().startOf('week')), 'yyyy-MM-dd'));
   $scope.toDate = (
      $filter('date')(new Date(moment().endOf('week')), 'yyyy-MM-dd'));


   $scope.resizeCanvas = function() {
      if ($scope.customerForm.show == false) {
         if ($scope.modal.isLastStep()) {
            var canvas = document.getElementById("shipper_sign");
            var data = $scope.generator_signaturePad.toDataURL();
            canvas.width = window.innerWidth - 75;
            document.getElementById('shipper_sign').addEventListener('click', function(evt) {
               console.log('onclick canvas==>');
            }, false);
            $scope.generator_signaturePad.fromDataURL(data);
         }
      }
   };

   window.addEventListener("resize", $scope.resizeCanvas);


   $scope.formRedirect = function() {

      $scope.customerForm.show = false;
      console.log('service_type BolDet ==>' + angular.toJson($scope.BolDet.service_type));
      console.log('BolDet==>' + angular.toJson($scope.BolDet));


      $scope.modal = {};
      if ($scope.BolDet.service_type == 1) {

         $scope.modal.steps = ['one', 'two', 'three'];

         $scope.modal.wizard = {
            tacos: 2
         };
      } else {


         //$scope.modal.steps = ['one', 'two', 'three','four','five'];
         $scope.modal.steps = ['one', 'two', 'three', 'four'];

         $scope.modal.wizard = {
            tacos: 3
         };

      }

      $scope.modal.step = 0;

      $scope.modal.isFirstStep = function() {
         return $scope.modal.step === 0;
      };

      $scope.modal.isLastStep = function() {
         return $scope.modal.step === ($scope.modal.steps.length - 1);
      };

      $scope.modal.isCurrentStep = function(step) {
         return $scope.modal.step === step;
      };

      $scope.modal.setCurrentStep = function(step) {
         $scope.modal.step = step;
      };

      $scope.modal.getCurrentStep = function() {
         return $scope.modal.steps[$scope.modal.step];
      };

      $scope.modal.getNextLabel = function() {

         if ($scope.modal.isLastStep()) {
            var canvas = document.getElementById("shipper_sign");
            canvas.width = window.innerWidth - 75; // set window width to canvas & customized
            // shipper Signature
            $scope.generator_sign_canvas = document.querySelector("#shipper_sign");
            $scope.generator_signaturePad = new SignaturePad($scope.generator_sign_canvas);
         }
         return ($scope.modal.isLastStep()) ? 'Submit' : 'Next';
      };

      $scope.modal.handlePrevious = function() {
         $scope.modal.step -= ($scope.modal.isFirstStep()) ? 0 : 1;
      };

      $scope.modal.handleNext = function() {
         $scope.modal.step += 1;
      };


   }; // end of formRedirect


   $scope.user = {};
   $scope.DestBolDet = {
      'bankerBox': 0,
      'legalBox': 0,
      'cleanoutOther': 0,
      'pickupService': 0,
      'cabinetDeliveryKey': 0,
      'stopByService': 0,
      'gallon2_5Pail': 0,
      'gallon5Pail': 0,
      'specialOther': 0
   };
   $scope.MedicalBolDet = {
      'bioMediContainerQty': 0,
      'bioMediWtInPounds': 0,
      'traceChemoContainerQty': 0,
      'traceChemoWtInPounds': 0,
      'pathoWasteContainerQty': 0,
      'pathoWasteWtInPounds': 0,
      'other1Item': 'Nothing',
      'other1ContainerQty': 0,
      'other1WtInPounds': 0,
      'other2Item': 'Nothing',
      'other2ContainerQty': 0,
      'other2WtInPounds': 0,
      'other3Item': 'Nothing',
      'other3ContainerQty': 0,
      'other3WtInPounds': 0
   };
   $scope.user.allow_shipper_sign = true;
   $scope.user.allow_transporter_sign = true;
   $scope.user.allow_receiving_sign =
      true;
   $scope.user.shipperSignatureImage = '';
   $scope.user.transporterSignatureImage = '';
   $scope.user.receivingFacilitySignatureImage =
      '';

   $scope.signatureImageBackEndUrl = 'http://localhost:9090/MCF_backend/opt/signImgs/';
   $scope.signatureImageFrontEndUrl =
      'app/img/';

   var url = document.location.toString().toLowerCase(); //  get current url
   $scope.last_string_in_url = url.split('/').pop(); // get last string in the url


   // console.log('bolController');

   $scope.saveGeneratorSign = function() {
      if ($scope.generator_signaturePad.isEmpty()) {
         return 'notvalid';
      } else {

         return $scope.generator_signaturePad.toDataURL().replace('data:image/png;base64,', '');
      }

   };

   $scope.clearGeneratorSign = function() {

      // Clears the canvas
      $scope.generator_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      $scope.generator_signaturePad.isEmpty();

      // Unbinds all event handlers
      $scope.generator_signaturePad.off();

      // Rebinds all event handlers
      $scope.generator_signaturePad.on();

   };

   $scope.saveTransporterSign = function() {
      return transporter_signaturePad.toDataURL().replace('data:image/png;base64,', '');
   };

   $scope.clearTransporterSign = function() {

      // Clears the canvas
      transporter_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      transporter_signaturePad.isEmpty();

      // Unbinds all event handlers
      transporter_signaturePad.off();

      // Rebinds all event handlers
      transporter_signaturePad.on();

   };


   $scope.saveReceivingFacilitySign = function() {
      return receiving_facility_signaturePad.toDataURL().replace('data:image/png;base64,', '');

   };

   $scope.clearReceivingFacility = function() {
      // Clears the canvas
      receiving_facility_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      receiving_facility_signaturePad.isEmpty();

      // Unbinds all event handlers
      receiving_facility_signaturePad.off();

      // Rebinds all event handlers
      receiving_facility_signaturePad.on();

   };

   $scope.clearAllSign = function() {

      $scope.user = {};
      // clear Generator signService

      // Clears the canvas
      generator_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      generator_signaturePad.isEmpty();

      // Unbinds all event handlers
      generator_signaturePad.off();

      // Rebinds all event handlers
      generator_signaturePad.on();


      // clear Transporter signService

      // Clears the canvas
      transporter_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      transporter_signaturePad.isEmpty();

      // Unbinds all event handlers
      transporter_signaturePad.off();

      // Rebinds all event handlers
      transporter_signaturePad.on();

      // Clears the canvas
      receiving_facility_signaturePad.clear();

      // Returns true if canvas is empty, otherwise returns false
      receiving_facility_signaturePad.isEmpty();

      // Unbinds all event handlers
      receiving_facility_signaturePad.off();

      // Rebinds all event handlers
      receiving_facility_signaturePad.on();

   };


   $scope.GetCustoemrInfoDetails = function() {

      signService.get(function(res) {
         //console.log("Customer");
         //console.log(res);

         $scope.user.accountNo = res.accountNo;
         //$scope.user.bolNo 					= res.bolNo;
         $scope.user.route = res.route;
         $scope.user.monthlyBill = res.monthlyBill;
         $scope.user.shipperSignatureImage = $scope.signatureImageBackEndUrl + res.transporterSignUrl;

         console.log('shipperSignatureImage==>' + $scope.user.shipperSignatureImage);
         $scope.user.shipperSignDate = res.shipperSignDate;
         $scope.user.allow_shipper_sign = false;

      }, function(error) {
         $scope.failShowGet = true;
         //$timeout(function() { $scope.failShowGet = false;}, 5000);
      });

   };


   $scope.SmRedBags = ['Nothing', 'Sharp Container 305344', 'Sharp Container 305464', 'Sharp Container 305491',
      'Sharp Container 8507S',
      'Sharp Container 8980', 'Sharp Container 8938', 'Sharp Container 8909', 'Sm Red Bags',
      'Sharp Container 8536SA', 'Sharp Container 93266', 'Box LIDS'
   ];


   $scope.showSpinner = false;


   $scope.saveMedicalBol = function() {


      console.log('shipperinfoController');

      if ($scope.saveGeneratorSign() == 'notvalid') {
         console.log('111');
         return false;
      } else {
         $timeout(function() {
            console.log('222');
         }, 100);
      }

      console.log('processedDate==>' + ($filter('date')(new Date(moment()), 'MM/dd/yyyy HH:mm:ss')));

      $scope.showSpinner = true;
      var signServiceObj = new signService();
      signServiceObj.driverName = $scope.username;
      signServiceObj.formType = 1;
      signServiceObj.assignmentId = $scope.BolDet.assignmentId;
      signServiceObj.processedDate = ($filter('date')(new Date(moment()), 'MM/dd/yyyy HH:mm:ss'));


      $scope.msgAccountNo = $scope.BolDet.accountNo;
      //signServiceObj.bolNo 		= Math.floor((Math.random()*1000) + 1);
      signServiceObj.monthlyBill = 'kloo';

      // bio medical null check

      if ($scope.MedicalBolDet.bioMediContainerQty == null)
         $scope.MedicalBolDet.bioMediContainerQty = 0;
      if ($scope.MedicalBolDet.bioMediWtInPounds == null)
         $scope.MedicalBolDet.bioMediWtInPounds = 0;

      // traceChemo null check

      if ($scope.MedicalBolDet.traceChemoContainerQty == null)
         $scope.MedicalBolDet.traceChemoContainerQty = 0;
      if ($scope.MedicalBolDet.traceChemoWtInPounds == null)
         $scope.MedicalBolDet.traceChemoWtInPounds = 0;

      // pathoWaste null check

      if ($scope.MedicalBolDet.pathoWasteContainerQty == null)
         $scope.MedicalBolDet.pathoWasteContainerQty = 0;
      if ($scope.MedicalBolDet.pathoWasteWtInPounds == null)
         $scope.MedicalBolDet.pathoWasteWtInPounds = 0;

      // Other1 null check

      if ($scope.MedicalBolDet.other1Item == 'Nothing')
         $scope.MedicalBolDet.other1Item = null;
      if ($scope.MedicalBolDet.other1ContainerQty == null)
         $scope.MedicalBolDet.other1ContainerQty = 0;
      if ($scope.MedicalBolDet.other1WtInPounds == null)
         $scope.MedicalBolDet.other1WtInPounds = 0;

      // Other2 null check

      if ($scope.MedicalBolDet.other2Item == 'Nothing')
         $scope.MedicalBolDet.other2Item = null;
      if ($scope.MedicalBolDet.other2ContainerQty == null)
         $scope.MedicalBolDet.other2ContainerQty = 0;
      if ($scope.MedicalBolDet.other2WtInPounds == null)
         $scope.MedicalBolDet.other2WtInPounds = 0;

      // Other3 null check

      if ($scope.MedicalBolDet.other3Item == 'Nothing')
         $scope.MedicalBolDet.other3Item = null;
      if ($scope.MedicalBolDet.other3ContainerQty == null)
         $scope.MedicalBolDet.other3ContainerQty = 0;
      if ($scope.MedicalBolDet.other3WtInPounds == null)
         $scope.MedicalBolDet.other3WtInPounds = 0;


      /** Bio-Medical Waste Add **/
      //signServiceObj.bioMediSmRedBags 			= $scope.MedicalBolDet.bioMediSmRedBags;

      signServiceObj.bioMediContainerQty = $scope.MedicalBolDet.bioMediContainerQty;

      signServiceObj.bioMediWtInPounds = $scope.MedicalBolDet.bioMediWtInPounds;

      /** Trace chemotherapy Waste Add **/

      //signServiceObj.traceChemoSmRedBags 		= $scope.MedicalBolDet.traceChemoSmRedBags;
      signServiceObj.traceChemoContainerQty = $scope.MedicalBolDet.traceChemoContainerQty;
      signServiceObj.traceChemoWtInPounds = $scope.MedicalBolDet.traceChemoWtInPounds;

      /** Pathological Waste Waste Add **/

      //signServiceObj.pathoWasteSmRedBags 		= $scope.MedicalBolDet.pathoWasteSmRedBags;
      signServiceObj.pathoWasteContainerQty = $scope.MedicalBolDet.pathoWasteContainerQty;
      signServiceObj.pathoWasteWtInPounds = $scope.MedicalBolDet.pathoWasteWtInPounds;


      /** Others1 or sharp1 Waste Waste Add **/


      signServiceObj.other1ContainerQty = $scope.MedicalBolDet.other1ContainerQty;
      signServiceObj.other1WtInPounds = $scope.MedicalBolDet.other1WtInPounds;
      signServiceObj.other1Item = $scope.MedicalBolDet.other1Item;

      /** Others2 or sharp2 Waste Waste Add **/

      signServiceObj.other2ContainerQty = $scope.MedicalBolDet.other2ContainerQty;
      signServiceObj.other2WtInPounds = $scope.MedicalBolDet.other2WtInPounds;
      signServiceObj.other2Item = $scope.MedicalBolDet.other2Item;

      /** Others3 or sharp3 Waste Waste Add **/

      signServiceObj.other3ContainerQty = $scope.MedicalBolDet.other3ContainerQty;
      signServiceObj.other3WtInPounds = $scope.MedicalBolDet.other3WtInPounds;
      signServiceObj.other3Item = $scope.MedicalBolDet.other3Item;

      signServiceObj.comment = $scope.MedicalBolDet.comment;

      $scope.MedicalBolDet.shipperSignDate = new Date();
      signServiceObj.shipperSignDate = ($filter('date')(new Date($scope.MedicalBolDet.shipperSignDate),
         'MM/dd/yyyy HH:mm:ss'));

      signServiceObj.transporterSignDate = ($filter('date')(new Date($scope.MedicalBolDet.shipperSignDate),
         'MM/dd/yyyy HH:mm:ss'));


      signServiceObj.route = 'atlanta';
      console.log('user.shipperSignDate=>' + signServiceObj.shipperSignDate);

      signServiceObj.shipperSign = $scope.saveGeneratorSign()


      //signServiceObj.customer.id	= $scope.BolDet.customerId;
      signServiceObj.customerNumber = $scope.BolDet.accountNo;
      signServiceObj.customerName = $scope.BolDet.customerName;
      signServiceObj.customerPhone = $scope.BolDet.number
      signServiceObj.customerEmail = $scope.BolDet.email;
      signServiceObj.customerCity = $scope.BolDet.customerCity;
      signServiceObj.customerState = $scope.BolDet.customerState;
      signServiceObj.customerZip = $scope.BolDet.customerZip;
      signServiceObj.customerAddress = $scope.BolDet.customerAddress;
      signServiceObj.monthlyBill = $scope.BolDet.monthly;

      console.log('signServiceObj==>' + angular.toJson(signServiceObj));

      $scope.failShowGet = true;
      $scope.successShow = false;



      $rootScope.pushTransMCF({
         typedb: 'med',
         transdate: new Date(),
         drivername: $scope.username,
         data: angular.toJson(signServiceObj)
      });

      // $rootScope.deleteAll();


      // Delete all records before today - 7 day


      // ******************************** TODO ********************************
      signServiceObj.$save(function(resp, headers) {
         $rootScope.sycDataToServer();
         ngDialog.openConfirm({
            template: 'MedicalResponseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         });
      });


      $scope.showSpinner = false;

      // hide wizard form & show customer details form start
      $scope.customerForm.show = true;
      $scope.canvasShow = false;


      for (var i = 0; i < $scope.assigned_customer.length; i++) {
         if ($scope.assigned_customer[i].bolType == 'Medical' && $scope.assigned_customer[i].customerNumber ==
            signServiceObj.customerNumber) {
            $scope.assigned_customer[i]['processed'] = true;
            localStorage.setItem('assigned_customer_data', JSON.stringify($scope.assigned_customer));
         }
      }


      $scope.BolDet = {};
      // hide wizard form & show customer details form end


      $scope.successShow = true;

      $scope.failShowGet = false;
      //$scope.user 	   = {};
      // Re initialize all values
      $scope.MedicalBolDet = {
         'bioMediContainerQty': 0,
         'bioMediWtInPounds': 0,
         'traceChemoContainerQty': 0,
         'traceChemoWtInPounds': 0,
         'pathoWasteContainerQty': 0,
         'pathoWasteWtInPounds': 0,
         'other1Item': 'Nothing',
         'other1ContainerQty': 0,
         'other1WtInPounds': 0,
         'other2Item': 'Nothing',
         'other2ContainerQty': 0,
         'other2WtInPounds': 0,
         'other3Item': 'Nothing',
         'other3ContainerQty': 0,
         'other3WtInPounds': 0
      };
      $scope.modal.step = 0; // Re initialize to first step


      if ($scope.offline_data_store == false) {
         ngDialog.openConfirm({
            template: 'MedicalResponseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {

         }, function(reason) {

         });
      }


   };


   $scope.saveBillOfLading = function() {
      //if ($scope.online_status_string == 'offline') {
      //   $scope.saveBillOfLadingOffline();
      //   return false;
      //} else {

      var save_gen_sign = $scope.saveGeneratorSign();

      // console.log('save_gen_sign==>' + save_gen_sign);


      if ($scope.saveGeneratorSign() == 'notvalid') {
         console.log('111');
         return false;
      } else {
         $timeout(function() {
            console.log('222dsds');
         }, 100);

      }


      //}

      $scope.showSpinner = true;
      var BillOfLadingObj = new signService();

      console.log('shipperinfoController');

      $scope.msgAccountNo = $scope.BolDet.accountNo;
      BillOfLadingObj.driverName = $scope.username;
      BillOfLadingObj.assignmentId = $scope.BolDet.assignmentId;
      BillOfLadingObj.processedDate = ($filter('date')(new Date(moment()), 'MM/dd/yyyy HH:mm:ss'));

      //BillOfLadingObj.customer	= {};

      BillOfLadingObj.formType = 2;


      /*
       if ($scope.offline_data_store == true) {
       //BillOfLadingObj.customer.id			= $scope.DestBolDet.customerId;
       $scope.msgAccountNo = $scope.DestBolDet.accountNo;
       BillOfLadingObj.assignmentId = $scope.DestBolDet.assignmentId;
       $scope.BolDet.assignmentId = $scope.DestBolDet.assignmentId;
       BillOfLadingObj.shipperSign = $scope.DestBolDet.shipperSign;

       BillOfLadingObj.customerName = $scope.DestBolDet.customerName;
       BillOfLadingObj.customerNumber = $scope.DestBolDet.customerNumber;
       BillOfLadingObj.customerEmail = $scope.DestBolDet.email;
       BillOfLadingObj.customerAddress = $scope.DestBolDet.customerAddress;

       console.log('BolDet==>' + angular.toJson($scope.BolDet));
       } else { */
      //BillOfLadingObj.customer.id	= $scope.BolDet.customerId;
      BillOfLadingObj.customerPhone = $scope.BolDet.number;
      BillOfLadingObj.monthlyBill = $scope.BolDet.monthly;


      BillOfLadingObj.customerName = $scope.BolDet.customerName;
      BillOfLadingObj.customerCity = $scope.BolDet.customerCity;
      BillOfLadingObj.customerState = $scope.BolDet.customerState;
      BillOfLadingObj.customerZip = $scope.BolDet.customerZip;
      BillOfLadingObj.customerNumber = $scope.BolDet.accountNo;
      BillOfLadingObj.customerEmail = $scope.BolDet.email;
      BillOfLadingObj.customerAddress = $scope.BolDet.customerAddress;
      BillOfLadingObj.shipperSign = $scope.saveGeneratorSign();
      $scope.clearGeneratorSign(); // clear generator sign
      // }


      if ($scope.DestBolDet.bankerBox == null)
         $scope.DestBolDet.bankerBox = 0;
      if ($scope.DestBolDet.legalBox == null)
         $scope.DestBolDet.legalBox = 0;
      if ($scope.DestBolDet.cleanoutOther == null)
         $scope.DestBolDet.cleanoutOther = 0;
      if ($scope.DestBolDet.pickupService == null)
         $scope.DestBolDet.pickupService = 0;
      if ($scope.DestBolDet.cabinetDeliveryKey == null)
         $scope.DestBolDet.cabinetDeliveryKey = 0;
      if ($scope.DestBolDet.stopByService == null)
         $scope.DestBolDet.stopByService = 0;
      if ($scope.DestBolDet.gallon2_5Pail == null)
         $scope.DestBolDet.gallon2_5Pail = 0;
      if ($scope.DestBolDet.gallon5Pail == null)
         $scope.DestBolDet.gallon5Pail = 0;
      if ($scope.DestBolDet.specialOther == null)
         $scope.DestBolDet.specialOther = 0;


      // Dest
      BillOfLadingObj.pickupService = $scope.DestBolDet.pickupService;
      BillOfLadingObj.cabinetDeliveryKey = $scope.DestBolDet.cabinetDeliveryKey;
      BillOfLadingObj.stopByService = $scope.DestBolDet.stopByService;

      // Cleanout
      BillOfLadingObj.bankerBox = $scope.DestBolDet.bankerBox;
      BillOfLadingObj.legalBox = $scope.DestBolDet.legalBox;
      BillOfLadingObj.cleanoutOther = $scope.DestBolDet.cleanoutOther;

      // Store
      /* BillOfLadingObj.gallon2_5Pail 		= $scope.DestBolDet.gallon2_5Pail;
       BillOfLadingObj.gallon5Pail 		= $scope.DestBolDet.gallon5Pail;
       BillOfLadingObj.specialOther 		= $scope.DestBolDet.specialOther;	*/
      BillOfLadingObj.formType = 2;
      BillOfLadingObj.comment = $scope.DestBolDet.comment;

      console.log('$scope.DestBolDet==>' + $scope.DestBolDet);


      $scope.user.shipperSignDate = new Date();
      BillOfLadingObj.shipperSignDate = ($filter('date')(new Date($scope.user.shipperSignDate),
         'MM/dd/yyyy HH:mm:ss'));
      $scope.user.transporterSignDate = new Date();
      BillOfLadingObj.transporterSignDate = ($filter('date')(new Date($scope.user.shipperSignDate),
         'MM/dd/yyyy HH:mm:ss'));


      // console.log('BillOfLadingObj==>' + angular.toJson(BillOfLadingObj));



      $rootScope.pushTransMCF({
         typedb: 'doc',
         transdate: new Date(),
         drivername: $scope.username,
         data: angular.toJson(BillOfLadingObj)
      });



      // ******************************** TODO ********************************
      BillOfLadingObj.$save(function(resp, headers) {
         $rootScope.sycDataToServer();
         ngDialog.openConfirm({
            template: "DocumentResponseMsgDialog",
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         })
      });


      $scope.showSpinner = false;
      $scope.canvasShow = false;
      $scope.successShow = true;
      $scope.failShowGet = false;

      //$scope.user 	   = {};
      $scope.DestBolDet = {}; // Re initialize all values
      $scope.modal.step = 0; // Re initialize to first step
      // hide wizard form & show customer details form start
      $scope.customerForm.show = true;

      // hide wizard form & show customer details form end
      for (var i = 0; i < $scope.assigned_customer.length; i++) {
         // console.log($scope.assigned_customer[i].bolType + "," + $scope.assigned_customer[i].customerNumber);
         if ($scope.assigned_customer[i].bolType == 'DOC' && $scope.assigned_customer[i].customerNumber ==
            BillOfLadingObj.customerNumber) {
            $scope.assigned_customer[i].processed = true;
            localStorage.setItem('assigned_customer_data', JSON.stringify($scope.assigned_customer));
         }
      }
      $scope.BolDet = {};
   };


   $scope.getselectval = function(item, index) {

      $scope.BolDet.email = item.email;
      $scope.BolDet.accountNo = item.customerNumber;
      $scope.BolDet.customerName = item.customerName;
      $scope.BolDet.customerAddress = item.shipAddress;
      $scope.BolDet.customerCity = item.shipCity;
      $scope.BolDet.customerState = item.shipState;
      $scope.BolDet.customerZip = item.shipZip;
      $scope.BolDet.number = item.number;
      $scope.BolDet.bolType = item.bolType;
      $scope.BolDet.assignmentId = item.id;
      $scope.BolDet.monthly = item.monthly;
      $scope.BolDet.customerPhone = item.number;


      if (item.bolType.toLowerCase() == 'doc')
         $scope.BolDet.service_type = 2;
      if (item.bolType.toLowerCase() == 'medical')
         $scope.BolDet.service_type = 1;


   };


   /********************* calandar start ***************************/



   $scope.minval = new Date();
   $scope.formats = ['dd/MM/yyyy HH:mm:ss', 'dd-MMMM-yyyy', 'yyyy/MM/dd',
      'dd.MM.yyyy', 'shortDate'
   ];
   var today = new Date();
   $scope.curntDate = ($filter('date')(new Date(today), 'yyyy-MM-ddTHH:mm:ss'));
   $scope
      .minDate =
      $scope.curntDate;
   var now = new Date();


   $scope.format = $scope.formats[0];


   $scope.user.shipperSignDate = $scope.user.transporterSignDate = $scope.user.receivingFacilitySignDate =
      new Date(
         now.getFullYear(), now.getMonth(),
         now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

   /******** driver sign date functionality ****/

   $scope.shipperSignDate = false;
   $scope.shipperSignDateAdd = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.shipperSignDate = true;
      /*$('.dropdown-menu').attr('style','');
       $(".dropdown-menu").removeAttr("style");*/
      $(".dropdown-menu table ").css({
         "width": "200px",
         "height": "200px"
      });
   };

   /********* Transporter sign date functionality ************/

   $scope.transporterSignDate = false;
   $scope.transporterSignDateAdd = function($event) {

      $event.preventDefault();
      $event.stopPropagation();
      $scope.transporterSignDate = true;
   };

   /********* Receiving facility sign date functionality ******/

   $scope.receivingFacilitySignDate = false;
   $scope.receivingFacilitySignDateAdd = function($event) {

      $event.preventDefault();
      $event.stopPropagation();
      $scope.receivingFacilitySignDate = true;
   };


   /********************* calandar end ***************************/

   angular.element(document).ready(function() { // document.ready


      var url = document.location.toString().toLowerCase(); //  get current url
      $scope.last_string_in_url = url.split('/').pop(); // get last string in the url


      $scope.finalStepSubmitDestbol = function() {

         ngDialog.openConfirm({
            template: 'DocumentAllDetailsDialog',
            className: 'ngdialog-theme-default custom-width-600',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {
            $scope.modal.handleNext();
         }, function(reason) {});
      };

      $scope.canvasShow = false;

      $scope.browserFullScreen = function() {


         /* detect mobile device
          if(window.innerWidth <= 800 && window.innerHeight <= 600) {
          } */


         var i = document.getElementById("fullscreen");
         if (!document.mozFullScreen && !document.webkitFullScreen) {
            // go full-screen
            if (i.requestFullscreen) {
               i.requestFullscreen();
            } else if (i.webkitRequestFullscreen) {
               i.webkitRequestFullscreen();
            } else if (i.mozRequestFullScreen) {
               i.mozRequestFullScreen();
            } else if (i.msRequestFullscreen) {
               i.msRequestFullscreen();
            }
         }


      };


      $scope.existscreen = function() {
         $scope.canvasShow = false;
         var el = document.getElementById('shipper_sign_area');

         if (el.webkitExitFullscreen) {
            el.webkitExitFullscreen();
         } else {
            el.mozCancelFullScreen();
         }

      };

      $scope.clickToSign = function() {

         document.getElementById('shipper_sign').addEventListener("touchstart", $scope.fullscreen);
         document.getElementById('shipper_sign').addEventListener("click", $scope.fullscreen);


      };

      $scope.finalStepSubmitMedicalbol = function() {

         // $scope.GeneratorSign = $scope.saveGeneratorSign();
         //$scope.clearGeneratorSign(); // clear generator sign


         ngDialog.openConfirm({
            template: 'MedicalAllDetailsDialog',
            className: 'ngdialog-theme-default custom-width-600',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {
            $scope.modal.handleNext();
         }, function(reason) {});
      };
   });


   /************* BOL List ****************/


   $scope.currentPage = 1;
   $scope.offset_val = 0;
   $scope.limit_val = 20;
   $scope.bol_list_table = [];


   //get another portions of data on page changed

   $scope.pageChanged = function() {
      $scope.BOL_list_table();
      console.log('currentPage==>' + $scope.currentPage);
   };

   $scope.getBolHistoryData = function(promiseobj) {
      promiseobj.$promise.then(function(data_history) {
         $scope.bol_list_table = [];
         $scope.totalItems = 0;
         //$timeout(function(){
         $scope.totalItems = data_history.count;

         angular.copy(data_history.data, $scope.bol_list_table);
         console.log('bol_list_table==>' + angular.toJson($scope.bol_list_table));
         $scope.spinnerShow = false;
         $scope.onLoadspinnerShow = false;
         //},100);
      });
   };


   $scope.onLoadspinnerShow = true;
   $scope.driverName = '';

   $scope.BOL_list_table = function(item) {

      console.log('item==>' + item);

      if (item != undefined)
         $scope.driverName = item;


      if ($scope.currentPage == 1) {
         $scope.offset_val = 0;

      } else {
         $scope.offset_val = ($scope.currentPage - 1) * 20;
      }


      var params = {};

      if ($scope.driverName != undefined && $scope.driverName != 'All' && $scope.driverName != '')
         params.driverName = $scope.driverName;

      if ($scope.fromDate != null && $scope.toDate != null) {

         params.serviceFrom = $scope.fromDate;
         params.serviceTo = $scope.toDate;

      }

      params.offset = $scope.offset_val;
      params.limit = $scope.limit_val;

      if ($scope.orderByColumn != null)
         params.orderBy = $scope.orderByColumn;

      if ($scope.orderType != null)
         params.type = $scope.orderType;

      var bol_list = signService.query(params);
      $scope.getBolHistoryData(bol_list);


   };

   $scope.custom_filter = {};
   $scope.keypress_cnt = 0;
   $scope.cusomt_filter_promise = '';
   $scope.custom_filter_enable =
      false;

   $scope.customFilterData = function() {

      console.log('in customFilterData');

      if ($scope.keypress_cnt == 0) {


         var params = {};

         if ($scope.driverName != '')
            params.driverName = $scope.driverName;

         params.offset = $scope.offset_val;
         params.limit = $scope.limit_val;

         $scope.customer_filter_promise = signService.query(params);

         console.log('in keypress_cnt before==>' + $scope.keypress_cnt);
         $scope.keypress_cnt++;
      }


      console.log('in keypress_cnt after==>' + $scope.keypress_cnt);

      $scope.customer_filter_promise.$promise.then(function(data_history) {
         var criteria = {};

         if ($scope.custom_filter.driverName != null)
            criteria.driverName = $scope.custom_filter.driverName;
         if ($scope.custom_filter.customerName != null)
            criteria.customerName = $scope.custom_filter.customerName;
         if ($scope.custom_filter.customerNumber != null)
            criteria.customerNumber = $scope.custom_filter.customerNumber;
         if ($scope.custom_filter.customerEmail != null)
            criteria.customerEmail = $scope.custom_filter.customerEmail;
         if ($scope.custom_filter.comment != null)
            criteria.comment = $scope.custom_filter.comment;
         if ($scope.custom_filter.mailSentDate != null)
            criteria.mailSentDate = $scope.custom_filter.mailSentDate;
         if ($scope.custom_filter.shipperSignDate != null)
            criteria.shipperSignDate = $scope.custom_filter.shipperSignDate;

         console.log('criteria==>' + angular.toJson(criteria));
         //console.log('array==>'+angular.toJson(data_reconcile.data));

         var object_keys = Object.keys(criteria);
         console.log('object_keys==>' + object_keys);
         if (angular.equals({}, criteria)) {

            $scope.custom_filter_enable = false;
            $scope.bol_list_table = [];
            $scope.totalItems = '';
            console.log('criteria check11==>' + angular.toJson(criteria));

            $scope.BOL_list_table();


         } else {
            $scope.custom_filter_enable = true;
            $scope.cusom_filter_data = $filter('filter')(data_history.data, criteria);

            //console.log('cusom_filter_data==>'+angular.toJson($scope.cusom_filter_data));

            $timeout(function() {

               $scope.overall_Data = [];
               $scope.overall_Data_fn = function(arr, chunkSize) {
                  var groups = [],
                     i;
                  for (i = 0; i < arr.length; i += chunkSize) {
                     groups.push(arr.slice(i, i + chunkSize));
                  }
                  return groups;
               };

               $scope.overall_Data = $scope.overall_Data_fn($scope.cusom_filter_data,
                  20);
               console.log('cusom_filter_data chunk11==>' + angular.toJson($scope.overall_Data));
               $scope.bol_list_table = $scope.overall_Data[0];
               $scope.totalItems = $scope.cusom_filter_data.length;
               console.log('totalItems==>' + $scope.totalItems);
               //angular.copy(data_reconcile.data, $scope.reconcileData)
            }, 1000);
         }
      });
   };

   /********* send bol details as pdf format to customer start *************/

   $scope.falseScope = function() {
      $scope.pdfsuccessShow = false;
      $scope.successShow = false;
      $scope.uptsuccessShow = false;
      $scope.failShowGet = false;
      console.log('delete after edit');
   };

   $scope.pdfsuccessShow = false;
   $scope.pdfspinnerShow = false;


   $scope.sendBOLPdf = function(obj) {
      var signServiceObj = new signService();
      $scope.pdfObj = obj;
      $scope.pdfspinnerShow = true;

      var dialog = ngDialog.openConfirm({
         template: 'responseMsgDialog',
         className: 'ngdialog-theme-default',
         preCloseCallback: 'preCloseCallback',
         scope: $scope
      }).then(function(value) {

      }, function(reason) {

         $scope.pdfspinnerShow = false;
         $scope.pdfsuccessShow = false;

      });

      $scope.falseScope();
      signServiceObj.bolId = [];

      if (obj != null) {
         $scope.selectedIds = [];
         $scope.selectedIds.push(obj.id);
         signServiceObj.bolId = $scope.selectedIds;
      } else {
         signServiceObj.bolId = $scope.selectedIds;
      }

      signServiceObj.$sendPdf().then(function(response) {
         $scope.pdfspinnerShow = false;
         $scope.pdfsuccessShow = true;
         $scope.pdfSendIds = response.mailedList;
         $scope.selectedIds = [];
         $scope.selectAllMaster = true;

         var send_pdf_response = response.mailedList;

         angular.forEach(send_pdf_response, function(value, index) {
            index = $scope.findindex($scope.bol_list_table, "assignmentId", value.assignmentId);
            console.log('index==>' + index);
            $scope.bol_list_table[index]['mailSentDate'] = value.mailSentDate;
         });
      });
   };

   /********* send bol details as pdf format to customer end *************/
   /**********************************/

   /************ view bol details ***********/

   $scope.signatureImageBackEndUrl = 'http://localhost:8080/MCF_backend/opt/signImgs/';
   $scope.signatureImageFrontEndUrl =
      'app/img/';


   $scope.viewBOLform = function(obj) {
      $scope.user = {};
      $scope.user = obj;

      $scope.user.shipperSignatureImage = $scope.signatureImageBackEndUrl + obj.shipperSignUrl;

      if (obj.shipperSignUrl == null)
         $scope.user.shipperSignatureImage = $scope.signatureImageFrontEndUrl + 'pending.jpg';

      $scope.user.transporterSignatureImage = $scope.signatureImageBackEndUrl + obj.transporterSignUrl;

      if (obj.transporterSignUrl == null)
         $scope.user.transporterSignatureImage = $scope.signatureImageFrontEndUrl + 'pending.jpg';

      $scope.user.receivingFacilitySignatureImage = $scope.signatureImageBackEndUrl + obj.receivFaciSignUrl;

      if (obj.receivFaciSignUrl == null)
         $scope.user.receivingFacilitySignatureImage = $scope.signatureImageFrontEndUrl +
         'pending.jpg';

      var templateId;
      if (obj.formType == 1) {
         templateId = 'app/views/custom/medical_bol_preview.html';
      } else {
         templateId = 'app/views/custom/document_bol_preview.html';
      }

      ngDialog.openConfirm({
         template: templateId,
         className: 'ngdialog-theme-default custom-width-1000',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {

      }, function(reason) {

      });
   };


   $scope.editMedicalBOLconfirm = function() {

      var signServiceObj = new signService();

      //$scope.MedicalBolDet = obj;
      //signServiceObj.accountNo 	= $scope.user.accountNo;
      /*signServiceObj.formType 	= 1;

       signServiceObj.bolNo 		= $scope.MedicalBolDet.bolNo; */
      $scope.msgAccountNo = $scope.MedicalBolDet.customerNumber;
      signServiceObj.monthlyBill = $scope.MedicalBolDet.monthlyBill;

      /*** Bio-Medical Waste Entries edited values ***/

      signServiceObj.bioMediContainerQty = $scope.MedicalBolDet.bioMediContainerQty;
      signServiceObj.bioMediWtInPounds = $scope.MedicalBolDet.bioMediWtInPounds;
      //signServiceObj.bioMediSmRedBags 			= $scope.MedicalBolDet.bioMediSmRedBags;

      /*** Trace chemotherapy Waste Entries edited values ***/

      //signServiceObj.traceChemoSmRedBags 		= $scope.MedicalBolDet.traceChemoSmRedBags;
      signServiceObj.traceChemoContainerQty = $scope.MedicalBolDet.traceChemoContainerQty;
      signServiceObj.traceChemoWtInPounds = $scope.MedicalBolDet.traceChemoWtInPounds;

      /*** Pathological Waste Entries edited values ***/

      //signServiceObj.pathoWasteSmRedBags 		= $scope.MedicalBolDet.pathoWasteSmRedBags;
      signServiceObj.pathoWasteContainerQty = $scope.MedicalBolDet.pathoWasteContainerQty;
      signServiceObj.pathoWasteWtInPounds = $scope.MedicalBolDet.pathoWasteWtInPounds;

      /** Others1 or sharp1 Waste Entries edited values **/

      signServiceObj.other1ContainerQty = $scope.MedicalBolDet.other1ContainerQty;
      signServiceObj.other1WtInPounds = $scope.MedicalBolDet.other1WtInPounds;
      signServiceObj.other1Item = $scope.MedicalBolDet.other1Item;

      /** Others2 or sharp2 Waste Entries edited values**/

      signServiceObj.other2ContainerQty = $scope.MedicalBolDet.other2ContainerQty;
      signServiceObj.other2WtInPounds = $scope.MedicalBolDet.other2WtInPounds;
      signServiceObj.other2Item = $scope.MedicalBolDet.other2Item;

      /** Others3 or sharp3 Waste Entries edited values **/

      signServiceObj.other3ContainerQty = $scope.MedicalBolDet.other3ContainerQty;
      signServiceObj.other3WtInPounds = $scope.MedicalBolDet.other3WtInPounds;
      signServiceObj.other3Item = $scope.MedicalBolDet.other3Item;

      signServiceObj.comment = $scope.MedicalBolDet.comment;

      $scope.falseScope();

      signServiceObj.$update({
         id: $scope.MedicalBolDet.id
      }).then(function(response) {
         $scope.uptsuccessShow = true;
         $scope.failShowGet = false;
         $scope.modal.step = 0; // Re initialize to first step

         ngDialog.openConfirm({
            template: 'responseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {}, function(reason) {});
      }, function(reason) {});
   };


   $scope.editBOL = function(obj) {
      var templateId;

      $scope.editFormType = obj.formType;
      $scope.modal = {};
      if (obj.formType == 1) {
         $scope.MedicalBolDet = obj;
         console.log('MedicalBolDet==>' + angular.toJson(obj));
         templateId = 'app/views/custom/medicalBolEdit.html';
         $scope.modal.steps = ['one', 'two', 'three'];
         $scope.modal.wizard = {
            tacos: 2
         };
      } else {
         $scope.DestBolDet = obj;
         console.log('DestBolDet==>' + angular.toJson(obj));
         templateId = 'app/views/custom/destructionBolEdit.html';
         //$scope.modal.steps = ['one', 'two', 'three','four','five'];
         $scope.modal.steps = ['one', 'two', 'three', 'four'];
         $scope.modal.wizard = {
            tacos: 3
         };
      }


      $scope.modal.step = 0;

      $scope.modal.isFirstStep = function() {
         return $scope.modal.step === 0;
      };

      $scope.modal.isLastStep = function() {

         return $scope.modal.step === ($scope.modal.steps.length - 1);
      };

      $scope.modal.isCurrentStep = function(step) {
         return $scope.modal.step === step;
      };

      $scope.modal.setCurrentStep = function(step) {
         $scope.modal.step = step;
      };

      $scope.modal.getCurrentStep = function() {
         return $scope.modal.steps[$scope.modal.step];
      };

      $scope.modal.getNextLabel = function() {
         if ($scope.modal.isLastStep() && $scope.last_string_in_url != 'bolhistory') {

            var canvas = document.getElementById("shipper_sign");
            canvas.width = window.innerWidth - 75; // set window width to canvas & customized


            // shipper Signature
            $scope.generator_sign_canvas = document.querySelector("#shipper_sign");
            $scope.generator_signaturePad = new SignaturePad($scope.generator_sign_canvas);
         }

         return ($scope.modal.isLastStep()) ? 'Submit' : 'Next';
      };

      $scope.modal.handlePrevious = function() {
         $scope.modal.step -= ($scope.modal.isFirstStep()) ? 0 : 1;
      };

      $scope.modal.handleNext = function() {
         $scope.modal.step += 1;
      };

      ngDialog.openConfirm({
         template: templateId,
         className: 'ngdialog-theme-default custom-width-600',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {

         // console.log('BolDet==>'+$scope.DestBolDet);

         if (obj.formType == 1) {
            $scope.editMedicalBOLconfirm();
         } else {
            $scope.editDestBOLconfirm();
         }

      }, function(reason) {

      });
   };


   $scope.editDestBOLconfirm = function() {

      $scope.msgAccountNo = $scope.DestBolDet.customerNumber;

      var BillOfLadingObj = new signService();
      // BillOfLadingObj.bolNo = $scope.DestBolDet.bolNo;

      if ($scope.DestBolDet.bankerBox) {
         BillOfLadingObj.bankerBox = $scope.DestBolDet.bankerBox;
      }

      if ($scope.DestBolDet.legalBox) {
         BillOfLadingObj.legalBox = $scope.DestBolDet.legalBox;
      }

      if ($scope.DestBolDet.cleanoutOther) {
         BillOfLadingObj.cleanoutOther = $scope.DestBolDet.cleanoutOther;
      }

      if ($scope.DestBolDet.service) {
         BillOfLadingObj.pickupService = $scope.DestBolDet.service;
      }

      if ($scope.DestBolDet.cabinetDelivery) {
         BillOfLadingObj.stopByService = $scope.DestBolDet.cabinetDelivery;
      }

      if ($scope.DestBolDet.cabinetKey) {
         BillOfLadingObj.cabinetDeliveryKey = $scope.DestBolDet.cabinetKey;
      }

      if ($scope.DestBolDet.comment) {
         BillOfLadingObj.comment = $scope.DestBolDet.comment;
      }

      $scope.falseScope();

      //console.log('BillOfLadingObj==>'+angular.toJson(BillOfLadingObj));

      BillOfLadingObj.$update({
         id: $scope.DestBolDet.id
      }).then(function(response) {

         $scope.uptsuccessShow = true;
         $scope.failShowGet = false;
         //$scope.user 	   = {};
         $scope.modal.step = 0; // Re initialize to first step

         ngDialog.openConfirm({
            template: 'DocumentResponseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {


         }, function(reason) {

         });

         /*
          $scope.DestBolDet.customerNumber = "";
          $scope.DestBolDet.bolNo = "";
          $scope.DestBolDet.bankerBox = "";
          $scope.DestBolDet.legalBox = "";
          $scope.DestBolDet.cleanoutOther = "";
          $scope.DestBolDet.service = "";
          $scope.DestBolDet.cabinetKey = "";
          $scope.DestBolDet.cabinetDelivery = "";
          $scope.DestBolDet.comment = "";
          */

         var ngdialogClose = document.querySelector('.ngdialog-close');
         ngdialogClose.addEventListener('click', $scope.falseS);

      }, function(reason) {});

   };


   // Delete Bol

   $scope.deleteBOL = function(obj) {
      $scope.deleteBol = obj;

      //console.log('obj==>'+angular.toJson($scope.deleteBol));

      ngDialog.openConfirm({
         template: 'deleteMsgDialog',
         className: 'ngdialog-theme-default custom-width-300',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {

         $scope.deleteBOLconfirm(obj);

      }, function(reason) {

      });
   };


   $scope.deleteBOLconfirm = function(obj) {
      var signServiceObj = new signService();

      $scope.deleteBol = obj;
      $scope.falseScope();

      signServiceObj.$destroy({
         id: obj.id
      }).then(function(response) {

         $scope.successShow = true;
         $scope.failShowGet = false;
         //$scope.user 	   = {};

         ngDialog.openConfirm({
            template: 'responseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {}, function(reason) {});

         $timeout(function() {
            $scope.BOL_list_table();
            $("div.btn-group > button").each(function(index) {
               $(this).dropdown();
               console.log("buttonpulldown: " + index);
            });
         }, 3000);

      }, function(reason) {});

   };


   angular.element(document).ready(function() { // document.ready
      // over ride the content-wrapper
      $(".ng-fadeInUp").removeClass("content-wrapper");
      //console.log('last_string_in_url==>'+$scope.last_string_in_url);
      switch ($scope.last_string_in_url) {
         case 'bolhistory':
            $scope.BOL_list_table();
            break;
      }
   });

   $scope.emailEdit = false;

   $scope.findindex = function(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
         if (arraytosearch[i][key] == valuetosearch) {
            return i;
         }
      }
      return null;
   };

   $scope.removeEmail = function() {
      var signServiceObj = new signService();
      signServiceObj.email = null;

      signServiceObj.$updateEmail({
         id: $scope.BolDet.assignmentId
      }, function(response) {
         $scope.deletesuccessShow = true;
         $scope.emailEdit = false;
         $scope.BolDet.email = null;
         $timeout(function() {
            $scope.deletesuccessShow = false;
         }, 3000);

      }, function(reason) {
         $scope.failShowGet = true;

         $rootScope.pushEmail({
            assignmentId: $scope.BolDet.assignmentId,
            data: angular.toJson(signServiceObj)
         }).then(function() {
            console.log("Add Email assignmentId:" + $scope.BolDet.assignmentId);
            $rootScope.db.emailstore.where('assignmentId').above(0).toArray(function(result) {
               // console.log(angular.toJson(result));
               // console.log(angular.toJson(result.length));
               $rootScope.offlineEmailCount = result.length;
               $scope.uptsuccessShow = true;
               $scope.emailEdit = false;
               $scope.$apply();
            });
         }).catch(function(error) {
            console.log("count error:" + error.message);
         });


         $timeout(function() {
            $scope.failShowGet = false;
         }, 3000);
      });
   };


   $scope.updateEmail = function() {
      var signServiceObj = new signService();

      signServiceObj.email = $scope.BolDet.email;

      signServiceObj.$updateEmail({
         id: $scope.BolDet.assignmentId
      }, function(resp, headers) {
         // console.log("resp:" + resp);
         $scope.uptsuccessShow = true;
         $scope.emailEdit = false;
      }, function(err) {
         $rootScope.pushEmail({
            assignmentId: $scope.BolDet.assignmentId,
            data: angular.toJson(signServiceObj)
         });
         //alert(
         //   "Email has been saved offline.  Login again and the transaction will be processed"
         //);
      });

      $timeout(function() {
         $scope.uptsuccessShow = false;
         $scope.emailEdit = false;
      }, 3000);

   };


   $scope.selectedIds = [];
   $scope.approvedBOLIds = [];
   $scope.selectAllMaster = true;


   $scope.toggleSelection = function(val) {
      var idx = $scope.selectedIds.indexOf(val.id);

      $scope.selectAllMaster = false;

      if (idx > -1) {
         $scope.selectedIds.splice(idx, 1);
         //$scope.selectAllMaster = true;
         if ($scope.selectedIds.length == 0) {
            $scope.selectAllMaster = true;
         }
      } else {
         $scope.selectedIds.push(val.id);

         if ($scope.selectedIds.length == $scope.bol_list_table.length) {
            $scope.selectAllMaster = true;
         }
      }

      console.log('selectedIds==>' + angular.toJson($scope.selectedIds));
      console.log('approvedBOLIds==>' + angular.toJson($scope.approvedBOLIds));
   };

   $scope.isRowSelected = function(id) {
      return $scope.selectedIds.indexOf(id) >= 0;
   };
   $scope.isAnythingSelected = function() {
      return $scope.selectedIds.length > 0;
   };

   $scope.selectAllBol = function(type) {
      if ($scope.selectAllMaster) {
         $scope.selectedIds = [];
         $scope.approvedBOLIds = [];
         angular.forEach($scope.bol_list_table, function(val, index) {

            console.log('approve==>' + val.approved);

            if (type == 'approve') {
               if (val.approved == true)
                  $scope.approvedBOLIds.push(val.customerNumber);
               if (val.approved == false)
                  $scope.selectedIds.push(val.id);
               console.log('approve==>' + $scope.selectedIds);

            } else if (type == 'print' || type == 'sendpdf') {
               $scope.selectedIds.push(val.id);
            }
         });
      }

      switch (type) {
         case 'approve':
            $scope.confirmApprovalBol();
            break;
         case 'print':
            $scope.bolPdfPreview(null, 'print');
            break;
         case 'sendpdf':
            $scope.sendBOLPdf();
            break;
      }

      console.log('selectedIds==>' + angular.toJson($scope.selectedIds));
      //console.log('approveBOLIds==>' + angular.toJson($scope.approveBOLIds));
   };

   // get driverList

   $scope.getDriverInfo = function() {
      signService.getDriverList(function(res) {

         $scope.driverList = res.drivers;
         $scope.driverList.push('All');
         //console.log(res);

      }, function(error) {
         $scope.failShowGet = true;
         //$timeout(function() { $scope.failShowGet = false;}, 5000);
      });
   };

   // update bolHistory email address start
   $scope.editBolEmail = function(obj, index) {
      $scope.bolCustomerEmail = obj.customerEmail;
      $scope.msgAccountNo = obj.customerNumber;
      $scope.editIndex = index;
      $scope.bolEmailEditObj = obj;

      ngDialog.openConfirm({
         template: 'EditEmailDialog',
         className: 'ngdialog-theme-default custom-width-300',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {
         console.log('customerEmailwewdfd==>' + $scope.bolCustomerEmail);


         $scope.UpdateBolEmail();

      }, function(reason) {

      });
   };

   // UpdateBolEmail

   $scope.UpdateBolEmail = function() {
      var BillOfLadingObj = new signService();

      //console.log('customerEmail==>'+$scope.bolCustomerEmail);

      BillOfLadingObj.customerEmail = $('#bolCustomerEmail').val();
      BillOfLadingObj.$update({
         id: $scope.bolEmailEditObj.id
      }).then(function(response) {

         $scope.emailsuccessShow = true;
         $scope.failShowGet = false;

         $scope.bol_list_table[$scope.editIndex]['customerEmail'] = response.customerEmail;

         ngDialog.openConfirm({
            template: 'responseMsgDialog',
            className: 'ngdialog-theme-default custom-width',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
         }).then(function(value) {}, function(reason) {
            $scope.emailsuccessShow = false;

         });

         $scope.BOL_list_table();
         var ngdialogClose = document.querySelector('.ngdialog-close');
         ngdialogClose.addEventListener('click', $scope.falseScope);

      }, function(reason) {});
   };


   // update bolHistory email address end
   // allow admin to approve action
   // update bolHistory email address start
   $scope.confirmApprovalBol = function(obj, index) {
      //console.log('obj==>'+angular.toJson($scope.deleteBol));
      if (obj != null) {
         $scope.selectedIds = [];
         $scope.selectedIds.push(obj.id);
      }

      //$timeout(function() {
      ngDialog.openConfirm({
         template: 'confirmApprovalDialog',
         className: 'ngdialog-theme-default custom-width-300',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {
         $scope.approveBOL(obj); // call approval BOL Method
      }, function(reason) {
         console.log('call cancel approval BOL');
         $scope.selectedIds = []; // empty the selected ids array
         $scope.approvedBOLIds = [];
         $scope.selectAllMaster = true;
      });
      //}, 500);

   };


   $scope.approvesuccessShow = false;
   $scope.approvespinnerShow = false;


   $scope.approveBOL = function(obj) {
      var signServiceObj = new signService();
      $scope.approveObj = obj;
      $scope.approvespinnerShow = true;
      $scope.approvesuccessShow = false;

      var dialog = ngDialog.openConfirm({
         template: 'responseMsgDialog',
         className: 'ngdialog-theme-default',
         preCloseCallback: 'preCloseCallback',
         scope: $scope
      }).then(function(value) {

      }, function(reason) {
         $scope.approvespinnerShow = false;
         $scope.approvesuccessShow = false;

      });

      $scope.falseScope();
      signServiceObj.bolList = [];
      signServiceObj.bolList = $scope.selectedIds;

      signServiceObj.$bolApproval().then(function(response) {
         $scope.approvespinnerShow = false;
         $scope.approvesuccessShow = true;
         $scope.approveSendIds = response.successList;
         $scope.selectedIds = [];
         $scope.selectAllMaster = true;

         var approval_response = response.successList;

         angular.forEach(approval_response, function(value, index) {
            var indexlocal = $scope.findindex($scope.bol_list_table, "id", value.id);
            console.log('index==>' + indexlocal);
            $scope.bol_list_table[indexlocal]['approved'] = true;
         });
      });
   };


   /** convert base64 data into blob prevent blocked-a-frame-with-origin-http http://localhost from-accessing-a-cross-origin **/

   function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         var slice = byteCharacters.slice(offset, offset + sliceSize);

         var byteNumbers = new Array(slice.length);
         for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
         }

         var byteArray = new Uint8Array(byteNumbers);

         byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {
         type: contentType
      });
      return blob;
   }

   // bol pdf preview & print
   $scope.showPdfPrintSpinner = false;


   // TODO Merge pdf
   $scope.bolPdfPreview = function(obj, type) {


      var signServiceObj = new signService();
      $scope.showPdfPrintSpinner = true;

      //signServiceObj.idList = [];
      //signServiceObj.idList.push(obj.id);

      console.log('$scope.selectedIds==>' + $scope.selectedIds);
      if (obj != null) {
         $scope.idList = [];
         $scope.idList.push(obj.id);
         signServiceObj.idList = $scope.idList;
         console.log('$scope.idList==>' + $scope.idList);

      } else {
         $scope.idList = [];


         signServiceObj.idList = $scope.selectedIds;
      }


      signServiceObj.$bolPreview().then(function(res) {
         // Create the Blob URL:


         var data = "data:application/pdf;base64," + res.pdfBytes;


         $scope.pdfContents = data;
         $scope.pdfBytes = res.pdfBytes;
         $scope.pdfBytesData = "data:application/pdf;base64," + res.pdfBytes;


         // window.open(data);
         $scope.showPdfPrintSpinner = false;

         if (type == 'print') {
            $timeout(function() {

               var popup = window.open("", "_blank");

               var blob = b64toBlob(res.pdfBytes, 'application/pdf');
               var blobUrl = URL.createObjectURL(blob);


               var html = '<!doctype html><html><head><title>BOL PDF</title></head>' +
                  '<body>' +
                  '<iframe id="iframe_print" style="width:100%;height:1000px;" src="' +
                  blobUrl +
                  '"></iframe>' +
                  '<script>function CheckIsIE(){if(navigator.appName.toUpperCase() == "MICROSOFT INTERNET EXPLORER"){ return true;  }else{return false; }}   function PrintThisPage(){if (CheckIsIE() == true){           document.content.focus();document.content.print();}else{console.log("print");var PDF = document.getElementById("iframe_print");  PDF.focus();   PDF.contentWindow.print();} }setTimeout("PrintThisPage();window.stop();", 2000)</script><style><type="text/css" media="print">body*{display:none}iframe{display:block}</style></body></html>';


               popup.document.write(html);
               $scope.selectAllMaster = true;
            }, 3000);
         } else {
            $timeout(function() {

               var popup = window.open("", "_blank");

               var blob = b64toBlob(res.pdfBytes, 'application/pdf');
               var blobUrl = URL.createObjectURL(blob);


               var html = '<!doctype html><html><head><title>BOL PDF</title></head>' +
                  '<body>' +
                  '<iframe id="iframe_print" style="width:100%;height:1000px;" src="' +
                  blobUrl +
                  '"></iframe>' +
                  '<script>setTimeout("window.stop();", 2000)</script></body></html>';


               popup.document.write(html);
               $scope.selectAllMaster = true;
            }, 3000);
         }


         $scope.selectedIds = []; // empty the selected ids array
         $scope.selectAllMaster = true;


      }, function(error) {
         $scope.failShowGet = true;
         //$timeout(function() { $scope.failShowGet = false;}, 5000);
      });
   };

   // sort table by column values
   $scope.orderProperty = 'customerName';

   $scope.setOrderProperty = function(propertyName) {
      if ($scope.orderProperty === propertyName) {
         $scope.orderProperty = '-' + propertyName;
         $scope.orderPropertyQuery = 'orderBy=customerEmail,shipperSignDate&type=desc';
         $scope.orderByColumn = propertyName;
         $scope.orderType = 'desc';
      } else if ($scope.orderProperty === '-' + propertyName) {
         $scope.orderProperty = propertyName;
         $scope.orderByColumn = propertyName;
         $scope.orderType = 'asc';
      } else {
         $scope.orderProperty = propertyName;
      }

      console.log('propertyName==>' + propertyName);

      $scope.BOL_list_table();
   };

   angular.element(document).ready(function() {

      console.log('location==>' + $location.path());

      if ($location.path() == '/app/bolHistory') {

         $scope.getDriverInfo();


         //console.log('fromDate==>'+$scope.fromDate);
         //console.log('todate==>'+$scope.toDate);


         /* Default Datepicker Calender Starts */

         // year starts
         $scope.openedEdit = false;
         /*$scope.today = function() {

          $scope.dt1 = new Date();
          $scope.dt =	$scope.dt1.setDate($scope.dt1.getDate() - 1);
          };
          $scope.minval = new Date();
          $scope.today();*/

         $scope.clear = function() {
            $scope.dt = null;
         };
         // Disable weekend selection
         $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
         };
         $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
            //alert("mindate")
         };
         $scope.toggleMin();
         $scope.openAdd = function($event) {
            //alert("add")
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedAdd = true;
         };
         $scope.openEdit = function($event) {
            //alert( $event.currentTarget === this );
            console.log("PICKER");
            console.log($event.currentTarget === this);
            if (angular.element($event.currentTarget)) {
               $event.preventDefault();
               $event.stopPropagation();
               $scope.openedEdit = true;
               $timeout(function() {
                  $scope.openedEdit = false;
               }, 3000);
            }
         };
         $scope.initDate = new Date('2016-15-20');
         $scope.formats = ['dd/MM/yyyy HH:mm:ss', 'dd-MMMM-yyyy', 'yyyy/MM/dd',
            'dd.MM.yyyy', 'shortDate'
         ];
         $scope.format = $scope.formats[0];

         $scope.formatsEdit = ['dd/MM/yyyy HH:mm:ss', 'dd-MMMM-yyyy', 'yyyy/MM/dd',
            'dd.MM.yyyy', 'shortDate'
         ];
         $scope.formatEdit = $scope.formatsEdit[0];

         $scope.datepickerOptions = {
            datepickerMode: "'day'",
            //minMode:"year",
            minDate: "minDate",
            //showWeeks:"false",
         };
         /* Default Datepicker Calender ends */


         /* DateRangePicker Calender starts */
         $('#config-text').keyup(function() {
            eval($(this).val());
         });

         $('.configurator input, .configurator select').change(function() {
            updateConfig();
         });

         $('.demo i').click(function() {
            $(this).parent().find('input').click();
         });


         updateConfig();

         function updateConfig(ngTableParams) {
            var options = {};
            if ($('#ranges').is(':checked')) {
               options.ranges = {
                  'Today': [moment(), moment()],
                  'Current Week': [moment().startOf('week'), moment().endOf('week')],
                  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(
                     1,
                     'month').endOf('month')]
               };
            }

            if (!$('#linkedCalendars').is(':checked'))
               options.linkedCalendars = false;
            if ($('#alwaysShowCalendars').is(':checked'))
               options.alwaysShowCalendars = true;

            $('#config-text').val("$('#demo').daterangepicker(" + JSON.stringify(options, null,
                  '    ') +
               ", function(start, end, label) {\n  console.log(\"New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')\");\n});"
            );
            //$scope.currentPage=1;
            $('#config-demo').daterangepicker(options, function(start, end, label) {

               //	console.log('New date range selected value: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ')');
               $scope.fromDate = start.format('YYYY-MM-DD');
               $scope.toDate = end.format('YYYY-MM-DD');
               var startOf = ($filter('date')(new Date($scope.fromDate), 'yyyy-MM-dd'));
               var endOf = ($filter('date')(new Date($scope.toDate), 'yyyy-MM-dd'));
               //console.log("date check");
               //	console.log($scope.fromDate +"                 "+ $scope.toDate);
               console.log('$scope.fromDate==>' + $scope.fromDate);
               console.log('$scope.toDate==>' + $scope.toDate);

               $scope.BOL_list_table();
            });
         }
      }
   });
});

App.controller('bolListController', function($scope, $state, $window, $timeout,
   $filter, $cookieStore, ngTableParams, ngDialog, signService, Customer) {

});
