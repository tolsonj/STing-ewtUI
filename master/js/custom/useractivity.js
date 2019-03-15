
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
           $scope.adminData = params.filter() ? $filter('filter')(data, params.filter()) : data;
           $defer.resolve($scope.adminData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
           params.total($scope.adminData.length); // set total for recalc pagination


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



          /* Get data index value from array object value ends starts */
             function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
                  for (var i = 0; i < arraytosearch.length; i++) {
                      if (arraytosearch[i][key] == valuetosearch) {
                          return i;
                      }
                  }
                  return null;
             }
         /* Get data (array object) index value from array object value ends*/

          /*Selecet multiple rows one by one and delete code starts*/

           $scope.multiple_del = [];
           $scope.getcheckboxId = function(checkval){
               $scope.checkbox_val = checkval;
               $scope.multiple_del.push($scope.checkbox_val);
             //  console.log($scope.multiple_del);
           };

           $scope.deleteSelectedRows = function(){
               for (var i = $scope.multiple_del.length - 1; i >= 0; i--) {
                 var dataId = $scope.multiple_del[i].id;
                 var index = functiontofindIndexByKeyValue(data, "id", dataId);
                 //alert(index);
                      var logDeleteInstance = new ActivityLog;
                      angular.extend(logDeleteInstance, $scope.multiple_del[i]);
                      logDeleteInstance.$destroy({id:dataId}).then(function(response){
                     //   console.log(response);
                      }, function(error){
                         $scope.failShowGet = true;
                         $timeout(function() { $scope.failShowGet = false;}, 5000);
                      });
                      data.splice(index,1);
                      $scope.tableParams.reload();
               }
               $scope.multiple_del = [];
               $scope.checkboxes = { 'checked': false, items: {} };
           };
          /*Selecet multiple rows one by one and delete code starts*/

           /*Selecet all rows and delete code starts*/

           $scope.checkboxes = { 'checked': false, items: {} };
            // watch for check all checkbox
           $scope.$watch('checkboxes.checked', function(value) {
                $scope.multiple_del = [];
                angular.forEach($scope.adminData, function(item) {
                   //  console.log("item");console.log(item);
                     $scope.multiple_del.push(item);
                     if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                      }
                });
            });

            // watch for data checkboxes
            $scope.$watch('checkboxes.items', function(values) {
                if (!$scope.users) {
                    return;
                }
                var checked = 0, unchecked = 0,
                    total = $scope.users.length;
                angular.forEach($scope.users, function(item) {
                    checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                    unchecked += (!$scope.checkboxes.items[item.id]) || 0;
                });
                if ((unchecked == 0) || (checked == 0)) {
                    $scope.checkboxes.checked = (checked == total);
                }
                // grayed checkbox
                angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
                $scope.deleteSelectedRows();
            }, true);

         /*Selecet all rows and delete code ends*/






});
