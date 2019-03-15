App.factory('CustomerAdmin', ["$resource", function($resource) {
    //return $resource('http://127.0.0.1\:8080/apiMCF/useradminlog/:id', { id: '@_id' }, {
		return $resource('server/custadmin.json', {
        update: { method: 'PUT', params: {id: '@id'}}
    });
}]);

App.controller('CustAdminController', ["$scope", "$state", "$window", "$filter", "ngTableParams", "ngDialog",  "CustomerAdmin", function($scope, $state, $window,  $filter, ngTableParams, ngDialog,   CustomerAdmin) {

$scope.userinfo = {email :"", password:""};


 var data = CustomerAdmin.query();
    
      data.$promise.then(function (data) {
         $scope.tableParams = new ngTableParams({
           page: 1,            // show first page
           count: 5,          // count per page
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
	   
	   // To delete the entire row
	   
	   $scope.deleteDialog = function () {		
         var row = this.$parent.admin;	   
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
       data.splice(index,1);
       $scope.tableParams.reload();
       CustomerAdmin.delete({id: data[index].id});
       // need a call to delete to the backend
    }, function (reason) {
      console.log('Cancel');
    });
  };
  

   // Edit dialog starts
		$scope.editDialog = function (editable) {
			
			
			var admin = this.$parent.admin;
			admin.isEditing = editable;
			var index = data.indexOf(admin);		
			
			admin.admininfo = {};
			admin.admininfo.email = admin.email;			
			admin.admininfo.password = admin.password;
		};		
		
		$scope.saveDialog = function () {
			if(this.$parent.admin.userForm.$valid)
			{
			var admin = this.$parent.admin;
			admin.isEditing = false;			
			var index = data.indexOf(admin);
					
			admin.email = admin.admininfo.email;			
			admin.password =  admin.admininfo.password;
			$scope.tableParams.reload();	
			}
			else
			{
				this.$parent.admin.submitted = true;
			}
			
		};
  

}]);



