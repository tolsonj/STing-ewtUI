/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

App.factory('InviteUserDATA', function($resource, $rootScope) {
   //console.log("endpoint: TEST dataaaaaaaaaaaaaaaaaa ");
   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var url = document.location.toString();
   var str = url;
   var lastSlash = str.lastIndexOf("/");
   var strtoken = str.substring(lastSlash + 1);

   // var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "inviteUser/getAllowedRoleByToken?token="+strtoken;

   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "inviteUser/getUserDetailsToRegisterByToken?token=" +
      strtoken;


   //http://localhost:8080/MCF_backend/InviteUser/getUserDetailsToRegisterByToken?token="fdsfwerwsdgfsdfgds"
   // console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");


   console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
         params: {},
         isArray: false
      }
   });
});



App.factory('RegisterLog', function($resource, $rootScope) {

   var url = document.location.toString();
   var str = url;
   var lastSlash = str.lastIndexOf("/");
   var strtoken = str.substring(lastSlash + 1);
   console.log("endpoint registerrrrrrrrrrrrrrrrr: " + strtoken);

   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "register/" + strtoken;
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   //console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
         params: {},
         isArray: false
      },
      save: {
         method: 'POST',
         //headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
         url: $rootScope.serverUrl + 'MCF_backend/register/' + strtoken,
         params: {}
      }
   });
});

App.controller('registerUserController', ['$scope', '$http', '$window', '$state', '$timeout', '$cookieStore',
   'ngDialog', 'secUser', 'secRole', 'RegisterLog', 'InviteUserDATA',
   function($scope, $http, $window, $state, $timeout, $cookieStore, ngDialog, secUser, secRole, RegisterLog,
      InviteUserDATA) {

      // bind here all data from the form
      $scope.account = {

         fname: "",
         lname: "",
         uname: "",
         email: "",
         password: "",
         phone: "",
         /*address:"",*/
         role: ""

      };
      // place the message if something goes wrong
      $scope.authMsg = '';
      $scope.msgReg = '';
      $scope.showmail = false;
      $scope.showuname = false;
      // $scope.registerlog = RegisterLog.query();

      $scope.showreg = true;
      $scope.invalidUser = false;
      $scope.showtimeout = false;

      var url = document.location.toString().toLowerCase();

      if (url.indexOf('@') != -1) {
         console.log('invite User found==>' + url);

         $scope.registerlog = RegisterLog.query(function(res) {

            if (res.message == "true") {
               $scope.showreg = true;

               console.log('showreg==>' + $scope.showreg);
               $scope.inviteuserdata = InviteUserDATA.query(function(res) {
                  console.log("res");
                  console.log(res.email);
                  console.log(res.customerNumber);
                  console.log(res.customerName);
                  $scope.regRole = res.role.authority;
                  $scope.regEmail = res.email;
                  $scope.regCompanyId = res.customerNumber; //res.externalCompanyId;
                  $scope.regCustname = res.customerName;
               }, function(error) {
                  $scope.showreg = false;
               });
            } else if (res.message == "Invalid URL request") {
               $scope.invalidUser = true;
               $scope.showreg = false;
            } else if (res.message == "URL timeout") {
               $scope.showtimeout = true;
               $scope.showreg = false;
            }
         }, function(error) {
            //console.log("ERROR");
            $scope.showreg = false;
         });

      }
      /*
  $scope.viewterms = function () {
		  var left = screen.width/2 - 200
        , top = screen.height/2 - 250
        , popup = $window.open('/app/views/terms', '', "top=" + top + ",left=" + left + ",width=500,height=200")
        , interval = 1000;
  };*/
      $scope.viewterms = function() {
         // alert(popData.length);
         ngDialog.openConfirm({
            template: '/app/views/terms.html',
            scope: $scope //Pass the scope object if you need to access in the template
         }).then(
            function(value) {
               //save the contact form
            },
            function(value) {
               //Cancel or do nothing
            }
         );
      };


      $scope.registerUser = function() {
         //alert("reg")
         // $scope.authMsg = '';

         if ($scope.registerForm.$valid) {

            var newregister = new RegisterLog();
            newregister.firstname = $scope.account.fname;
            newregister.lastname = $scope.account.lname;
            newregister.username = $scope.account.uname;
            newregister.customerName = $scope.regCustname; //$scope.account.uname;
            newregister.email = $scope.regEmail; //$scope.account.email;
            newregister.password = $scope.account.password;
            //newregister.repassword = $scope.account.account_password_confirm;
            newregister.phone = $scope.account.phone;
            newregister.customerNumber = $scope.regCompanyId; //$scope.account.regCompanyId;
            //newregister.address = $scope.account.address;
            //newregister.enabled = false;
            //console.log(newregister);
            //	console.log(angular.toJson(newregister));
            newregister.$save().then(function(response) {

               //	console.log(response);
               if (response.message == 'Please Use Invited E-mail ID.') {
                  //console.log(response.message);
                  $scope.showmail = true;
               } else if (response.message == 'Username already exists. Try some other.') {
                  $scope.showuname = true;
               } else if (response.message == 'Invalid URL request') {
                  $scope.invalidUser = true;
                  $scope.showreg = false;

               } else if (response.message == 'Registered Successfully.') {

                  $scope.msgPass =
                     'Registration completed Successfully. You are going to redirect login page..';

                  $cookieStore.put('registerform', 'success');

                  $timeout(function() {
                     $scope.msgReg = '';
                     $window.location.href = '#/page/login';
                  }, 5000);
                  $scope.account.fname = "";
                  $scope.account.lname = "";
                  $scope.account.uname = "";
                  $scope.account.email = "";
                  $scope.account.password = "";
                  $scope.account.role = "";
                  $scope.account.account_password_confirm = "";
                  $scope.account.phone = "";
                  $scope.account.extnlcompanyId = "";
                  /*
			// not necessary below code.because of redirect to login page
 	    var myEl1 = angular.element( document.querySelector( '#divCustname' ) );
        myEl1.empty();
        var myEl2 = angular.element( document.querySelector( '#divCompanyId' ) );
        myEl2.empty();
        var myEl1 = angular.element( document.querySelector( '#divEmail' ) );
        myEl3.empty();
        var myEl4 = angular.element( document.querySelector( '#divrole' ) );
        myEl4.empty(); */
                  //$scope.account.address ="";
                  $scope.showmail = false;
                  $scope.showuname = false;
                  $scope.account.agreed = false;

               } else {
                  $scope.showreg = false;
                  $scope.showtimeout = true;
               }
            }, function(x) {
               $scope.authMsg = 'Registration Failed';
               $timeout(function() {
                  $scope.authMsg = '';
               }, 5000)

            });



            //$scope.registerForm.account_email.$dirty = false;
            $scope.registerForm.account_password.$dirty = false;
            $scope.registerForm.account_agreed.$dirty = false;
            $scope.registerForm.account_uname.$dirty = false;
            $scope.registerForm.account_fname.$dirty = false;
            $scope.registerForm.account_lname.$dirty = false;
            //$scope.registerForm.account_address.$dirty = false;

         } else {

            // set as dirty if the user click directly to login so we show the validation messages
            //$scope.registerForm.account_email.$dirty = true;
            $scope.registerForm.account_password.$dirty = true;
            $scope.registerForm.account_agreed.$dirty = true;
            $scope.registerForm.account_uname.$dirty = true;
            $scope.registerForm.account_fname.$dirty = true;
            $scope.registerForm.account_lname.$dirty = true;
            //$scope.registerForm.account_address.$dirty = true;

         }
      };

   }
]);
