
App.factory('ActivityLog', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "useractivity";
  //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  //console.log("endpoint: " + endpoint);

  return $resource(endpoint, {}, {

		query: {
			method: 'GET',
			params: {},
			isArray: true,
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
			},
		destroy: {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/useractivity/:id',
			params: {id: '@_id'}
			}
    });
});


App.controller('useractivityController', function($scope, $state,$timeout, $window, $cookieStore, $filter, ngTableParams, ngDialog,  ActivityLog, Flash) {

$scope.userinfo = {username :"", password:""};
$scope.userdata = $cookieStore.get('setUsername');
$scope.onexistfail = true;
$scope.failShowGet = false;
//alert(userdata);

  var data = ActivityLog.query(function(res){

  }, function(error){
        $scope.failShowGet = true;
        $timeout(function() { $scope.failShowGet = false;}, 5000);
 });

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
           var adminData = params.filter() ? $filter('filter')(data, params.filter()) : data;
           $defer.resolve(adminData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
           params.total(adminData.length); // set total for recalc pagination


           }
         });


       });

       $scope.deleteDialog = function (actionOn,id) {

       	$scope.getaction = actionOn;
        	$scope.idval = id;

       	var row = this.$parent.activitylog;
           ngDialog.openConfirm({
             template: 'deleteDialogId',
             className: 'ngdialog-theme-default',
             preCloseCallback: 'preCloseCallbackOnScope',
             scope: $scope
           }).then(function (value) {
             // Delete from database
             console.log('Delete');
              // deleted from browser

              var index = data.indexOf(row);
             // Landfills.delete({id: data[index].id});

       	     var logDelete = new ActivityLog;
       		   angular.extend(logDelete, data[index]);
       		   logDelete.$destroy({id:$scope.idval}).then(function(response){
               data.splice(index,1);
               $scope.tableParams.reload();
             },function(reason){
                  $scope.failShowGet = true;
                  $timeout(function() { $scope.failShowGet = false;}, 5000);
             });



              // need a call to delete to the backend
           }, function (reason) {
             console.log('Cancel');
           });
         };








});
