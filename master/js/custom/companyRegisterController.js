/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/




App.factory('CompanyRegisterLog', function($resource, $rootScope) {

//console.log("endpoint registerrrrrrrrrrrrrrrrr: " + strtoken);

  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "CompanyRegister/registerCompany";
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
			url: $rootScope.serverUrl + 'MCF_backend/CompanyRegister/registerCompany',
			params: {}
			}
    });
});

App.controller('companyRegisterController', ['$scope', '$http', '$window','$state', '$timeout', 'ngDialog','secUser', 'secRole', 'CompanyRegisterLog',  function($scope, $http,$window, $state, $timeout, ngDialog,  secUser, secRole, CompanyRegisterLog) {
  $scope.account = {

    name: "",
    address: "",
    phone: "",
    adminame: "",
    admin_password: "",
    adminemail: "",
    adminmobile: ""

  };
  // place the message if something goes wrong
  $scope.authMsg = '';
  $scope.msgReg = '';
  $scope.showmail = false;
  $scope.showuname = false;

  var data = CompanyRegisterLog.query(function(res) {

	console.log(res);
	}, function(error) {
		console.log("ERROR");
		$scope.showreg = false;
	});

  $scope.viewterms = function() {
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

  $scope.registerCompany = function() {
    if($scope.registerForm.$valid) {
 		   var newregister = new CompanyRegisterLog();
 		   newregister.company_name = $scope.company.name;
 		   newregister.company_address = $scope.company.address;
 		   newregister.company_phone = $scope.company.phone;
       newregister.company_admin_name = $scope.company.adminame;
       newregister.company_admin_password = $scope.company.admin_password;
 		   newregister.company_admin_email = $scope.company.adminemail;
 		   newregister.company_admin_mobile = $scope.company.adminmobile;
      //console.log(newregister);
 		  //console.log(angular.toJson(newregister));
 		  newregister.$save().then(function(response) {
 		   //console.log(response);
         $scope.msgReg = 'Registered Successfully';
         $timeout(function(){ $scope.msgReg = '';	},5000);
         $scope.company.name ="";
         $scope.company.address ="";
         $scope.company.phone ="";
         $scope.company.adminame ="";
         $scope.company.adminemail ="";
         $scope.company.adminmobile ="";
         $scope.company.admin_password ="";
         $scope.company.admin_password_confirm ="";

         $scope.showmail= false;
         $scope.company.agreed= false;
         }, function(x) {
           	$scope.authMsg = 'Registration Failed';
 			         $timeout(function(){
 				             $scope.authMsg = '';
 			                },5000)
         });


 		 $scope.registerForm.company_name.$dirty = false;
 		 $scope.registerForm.company_address.$dirty = false;
 		 $scope.registerForm.company_phone.$dirty = false;
 		 $scope.registerForm.company_adminame.$dirty = false;
     $scope.registerForm.company_admin_password.$dirty = false;
 		 $scope.registerForm.company_adminemail.$dirty = false;
 		 $scope.registerForm.company_adminmobile.$dirty = false;
     $scope.registerForm.company_agreed.$dirty = false;

   }
   else {
       // set as dirty if the user click directly to login so we show the validation messages
       $scope.registerForm.company_name.$dirty = true;
       $scope.registerForm.company_address.$dirty = true;
       $scope.registerForm.company_phone.$dirty = true;
       $scope.registerForm.company_adminame.$dirty = true;
       $scope.registerForm.company_admin_password.$dirty = true;
       $scope.registerForm.company_adminemail.$dirty = true;
       $scope.registerForm.company_adminmobile.$dirty = true;
       $scope.registerForm.company_agreed.$dirty = true;
  }
 };


}]);
