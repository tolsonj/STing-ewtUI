

App.factory('CompanyAdmins', function($resource,$rootScope) {
    // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "vehicles";
    var endpoint = $rootScope.serverUrl  + $rootScope.apiMCF + "company/getCompaniesAndItsAdmin";

    //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
    //console.log("endpoint: " + endpoint);

    return $resource(endpoint, {}, {
		query: {
			method: 'GET', params: {},
			isArray: true,
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
			},
    update: {
			method: 'POST',	isArray: false,
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/company/editCompanyAndItsAdmin',
			params: {}
    },
		destroycompany: {
			method: 'POST',
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/company/deleteCompanyAndItsAdmin',
			params: {}
			}
  });
});



App.controller('companyadminsController', function($rootScope, $scope, $state, $window, $filter, Flash, ngTableParams, ngDialog, CompanyAdmins,  $timeout) {

	$scope.successShow = false;
	$scope.failShowGet = false;
  $scope.uptsuccessShow = false;

$scope.companyadminsInfo = {
  company_id:1,
  company_name:"XYZ & co",
  company_address:"Melapudur",
  company_phone:"66666666",
  company_admin_id:2,
  company_admin_username:"test2",
  company_admin_email:"test2@some.com",
  company_admin_phone:"56456464644654"


};
  var data = CompanyAdmins.query(function(res){
      console.log("success");
  },function(error){
      $scope.failShowGet = true;
      //$timeout(function() { $scope.failShowGet = false;}, 5000);
  });
  $scope.editDialog = function (editable) {
    var companyadmins = this.$parent.companyadmins;
    companyadmins.isEditing = editable;
    var index = data.indexOf(companyadmins);

    companyadmins.companyadminsInfo = {};
    companyadmins.companyadminsInfo.company_id = companyadmins.company_id;
    companyadmins.companyadminsInfo.company_name = companyadmins.company_name;
    companyadmins.companyadminsInfo.company_address = companyadmins.company_address;
    companyadmins.companyadminsInfo.company_phone = companyadmins.company_phone;
    companyadmins.companyadminsInfo.company_admin_id = companyadmins.company_admin_id;
    companyadmins.companyadminsInfo.company_admin_username = companyadmins.company_admin_username;
    companyadmins.companyadminsInfo.company_admin_email = companyadmins.company_admin_email;
    companyadmins.companyadminsInfo.company_admin_phone = companyadmins.company_admin_phone;
  };

  $scope.saveDialog = function () {
		if(this.$parent.companyadmins.userForm.$valid){
			var companyadmins = this.$parent.companyadmins;
			companyadmins.isEditing = false;
			var index = data.indexOf(companyadmins);

      var companyadminsUpdate = new CompanyAdmins;
			companyadminsUpdate.company_id = companyadmins.companyadminsInfo.company_id;
			companyadminsUpdate.company_name = companyadmins.companyadminsInfo.company_name;
			companyadminsUpdate.company_address = companyadmins.companyadminsInfo.company_address;
			companyadminsUpdate.company_phone = companyadmins.companyadminsInfo.company_phone;
			companyadminsUpdate.company_admin_id = companyadmins.companyadminsInfo.company_admin_id;
			companyadminsUpdate.company_admin_username = companyadmins.companyadminsInfo.company_admin_username;
			companyadminsUpdate.company_admin_email = companyadmins.companyadminsInfo.company_admin_email;
			companyadminsUpdate.company_admin_phone = companyadmins.companyadminsInfo.company_admin_phone;

      //console.log(companyadminsUpdate);
      companyadminsUpdate.$update().then(function(response){
        //console.log("response"+ angular.toJson(response));
        angular.extend(data[index],response);
        $scope.tableParams.reload();
      }, function (error) {
        //  console.log(error);
      });
		}
		else{
			this.$parent.companyadmins.submitted = true;
		}

	};


  $scope.deleteDialog = function (company_name, admin_name) {
    $scope.getcompanyName = company_name;
  	$scope.getadminName = admin_name;
  	var row = this.$parent.companyadmins;
      ngDialog.openConfirm({
        template: 'deleteDialogId',
        className: 'ngdialog-theme-default',
        preCloseCallback: 'preCloseCallbackOnScope',
        scope: $scope
      }).then(function (value) {
         var index = data.indexOf(row);
        // console.log('Delete'+index);

  	     var deletecompany = new CompanyAdmins;
         deletecompany.company_id = data[index].company_id;
         deletecompany.company_admin_id = data[index].company_admin_id;
  		    angular.extend(deletecompany, data[index]);
  		    deletecompany.$destroycompany().then(function(response){
          //  console.log(response.message);
          //  if(response.message =="deleted"){
              data.splice(index,1);
              $scope.tableParams.reload();
          //  }
        }, function(error){
            $scope.failShowGet = true;
  			    $timeout(function() { $scope.failShowGet = false;}, 5000);
          });



         // need a call to delete to the backend
      }, function (reason) {
        console.log('Cancel');
      });
    };

  data.$promise.then(function (data) {
         $scope.tableParams = new ngTableParams({
           page: 1,            // show first page
           count: 10,          // count per page
           filter: {
            // status:'H'       // initial filter
           }
         }, {
           total: data.length, // length of data
           getData: function($defer, params) {
             // use build-in angular filter
           $scope.companyadminsData = params.filter() ? $filter('filter')(data, params.filter()) : data;
           $defer.resolve($scope.companyadminsData .slice((params.page() - 1) * params.count(),  params.page() * params.count()));
           params.total($scope.companyadminsData .length); // set total for recalc pagination

           }
         });
  });




});
// End of Vehicles ********************************************************************************************************
