
App.factory('Company', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "customers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "company";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      isArray: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }
    },
    save: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl + 'MCF_backend/company',
      params: {}
    },
    update: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl + 'MCF_backend/company/:id',
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
      url: $rootScope.serverUrl + 'MCF_backend/company/:id',
      params: {
        id: '@_id'
      }
    }
  });
});



App.controller('companyController', function($scope, $state, $window, $timeout,
  $filter, $cookieStore, ngTableParams, ngDialog, Company) {

 $scope.loggedUser = $cookieStore.get("setUsername");
 var data = Company.query();
 //console.log(data);
 $scope.company = Company.query(function(res){
 }, function(error){

 });
 var company_info = $scope.company;
 company_info.$promise.then(function(company_info) {
   $scope.company_id = company_info.id;
   $scope.company_addr = company_info.address;
   $scope.company_city = company_info.city;
   $scope.company_state = company_info.state;
   $scope.company_zip = company_info.zip;
   $scope.company_phone = company_info.phone;
   $scope.company_email = company_info.email;

 });


});
