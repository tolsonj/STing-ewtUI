
// Containers ********************************************************************************************************


App.factory('ContainerSize', function($resource, $rootScope) {
    // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
    var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "containersize";
    // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
    console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
    console.log("container endpoint: " + endpoint);

    return $resource(endpoint, {}, {
    query: {
		method: 'GET',
		params: {},
		isArray: true,
		headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
		},

    save: {
		method: 'POST',
		headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: endpoint, params: {}
		},
  	update: {
		method: 'PUT',
		headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
		url: endpoint +'/:id',
		params: {id: '@_id'}
		},
 	  destroy: {
		  method: 'DELETE',
		  headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
		  url: endpoint + '/:id',
		  params: {id: '@_id'}
		}
  });
});

App.controller('ContainerSizeController', function($scope, $state, $window,$timeout,  ngDialog, $filter, ngTableParams, ContainerSize, Orders) {
    $scope.addcontainerInfo = {
        id: "",
        size: "",
        description: ""
    };
	$scope.successShow = false;
  $scope.failShowGet = false;
  $scope.uptsuccessShow = false;


    var data = ContainerSize.query(function(res){
     console.log("success");
     //console.log(res);
    },function(error){
      $scope.failShowGet = true;
      console.log("error");
      //console.log(error);
    });

  $scope.editDialog = function (editable) {
	  var containersize = this.$parent.containersize;
	  containersize.isEditing = editable;
	  var index = data.indexOf(containersize);

	  containersize.containersizeInfo = {};
	  containersize.containersizeInfo.id = containersize.id;
	  containersize.containersizeInfo.size = containersize.size;

	  //user.orderinfo.containersize = {size : user.containersize.size};


      $scope.tableParams.reload();
  };

  $scope.saveDialog = function () {
	if(this.$parent.containersize.userForm.$valid)
		{
			var containersize = this.$parent.containersize;
			containersize.isEditing = false;
			var index = data.indexOf(containersize);

			containersize.id = containersize.containersizeInfo.id;
			containersize.size = containersize.containersizeInfo.size;
			//user.containersize = {size : user.orderinfo.containersize.size};

			console.log("Edit:"+angular.toJson(containersize.containersizeInfo));
			$scope.tableParams.reload();

			var containersizeUpdateInstance = new ContainerSize;
			angular.extend(containersizeUpdateInstance, data[index]);
			containersizeUpdateInstance.$update({id:data[index].id}).then(function(response) {
        //console.log("response");
        $scope.uptsuccessShow = true;
				$timeout(function() {$scope.uptsuccessShow = false;}, 5000);
      },function(error){
        $scope.failShowGet = true;
			  $timeout(function() { $scope.failShowGet = false;}, 5000);
      });
		}
	else
		{
			this.$parent.containersize.submitted = true;
		}
			/* var containersizeUpdateInstance = new ContainerSize
      angular.extend(containersizeUpdateInstance, data[index]);
      containersizeUpdateInstance.$update({id:data[index].id});
		 */
	  };

	$scope.deleteDialog = function (contSize) {
		$scope.getcontSize = contSize;
			var row = this.$parent.containersize;
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
				var containersizeDeleteInstance = new ContainerSize;
				angular.extend(containersizeDeleteInstance, data[index]);
				containersizeDeleteInstance.$destroy({id:data[index].id}).then(function(response) {
          data.splice(index,1);
          console.log(index);
          $scope.tableParams.reload();

        },function(error){
          $scope.failShowGet = true;
			    $timeout(function() { $scope.failShowGet = false;}, 5000);
        });

				// need a call to delete to the backend
				}, function (reason) {
				console.log('Cancel');

			});
		};
	$scope.addDialog = function () {
      // Reset containersize object
	if($scope.containersizeForm.$valid)
	 {

	  var newContainerSize = new ContainerSize;
     // angular.extend(newContainer, $scope.addcontainerInfo);
	  //newContainerSize.id = $scope.addcontainersizeInfo.id;
	  newContainerSize.size = $scope.addcontainersizeInfo.size;

	  console.log("Add:"+angular.toJson(newContainerSize));
      newContainerSize.$save().then(function(response){
			console.log("Response:"+angular.toJson(response));
			data.push(response);
			$scope.tableParams.reload();
      $scope.successShow = true;
      $timeout(function() {$scope.successShow = false;}, 5000);

	  }, function(reason) {
      $scope.failShowGet = true;
      $timeout(function() { $scope.failShowGet = false;}, 5000);
		});


      $scope.addcontainersizeInfo.id = "",
      $scope.addcontainersizeInfo.size = "";


	    $scope.containersizeForm.size.$dirty = false;


   }
   else
   {

	    $scope.containersizeForm.size.$dirty = true;
		$scope.containersizeForm.desc.$dirty = true;
   }
};





  // watch for check all checkbox
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
         $scope.containersizeData = params.filter() ? $filter('filter')(data, params.filter()) : data;
         $defer.resolve($scope.containersizeData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
         params.total($scope.containersizeData.length); // set total for recalc pagination

         }
       });
     });

     $scope.orders = Orders.query();

   function compare(a, b) {
       if (a.name < b.name)
           return -1;
       else if (a.name > b.name)
           return 1;
       else
           return 0;
   }

  $scope.mappedOrders = [];
   $scope.orders.$promise.then(function(results) {
       $scope.orders = results;
       $scope.orders.sort(compare);
       for (var i = 0, len = $scope.orders.length; i < len; i++) {
           console.log($scope.orders[i].CONTAINER_SIZE_ID);
           $scope.mappedOrders.push($scope.orders[i].CONTAINER_SIZE_ID);
           console.log("mapped"); console.log($scope.mappedOrders);
       }
   });

   $scope.findorders = function(ordersId) {
      for (var i = 0, len = $scope.orders.length; i < len; i++) {
          if ($scope.orders[i].CONTAINER_SIZE_ID == ordersId) return $scope.orders[i];
      }
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
       function findindex(arraytosearch, key, valuetosearch) {
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
      $scope.getcheckboxId = function(selected_data, getcheckval){
          $scope.checkbox_val = selected_data;
         if(getcheckval == true){
           $scope.multiple_del.push($scope.checkbox_val);
         }
         if(getcheckval == false){
           var index = findindex($scope.multiple_del, "id", selected_data.id);
           $scope.multiple_del.splice(index,1);
         }
         console.log($scope.multiple_del);
      };

      $scope.deleteSelectedRows = function(){
          for (var i = $scope.multiple_del.length - 1; i >= 0; i--) {
                 var dataId = $scope.multiple_del[i].id;
                 var index = functiontofindIndexByKeyValue(data, "id", dataId);
                 //alert(index);
                 var containersizeInstance = new ContainerSize;
                 angular.extend(containersizeInstance, $scope.multiple_del[i]);
                 containersizeInstance.$destroy({id:dataId}).then(function(response){
                   console.log(response);
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
           angular.forEach($scope.containersizeData, function(item) {
                var index = $scope.mappedOrders.indexOf(item.id);
                console.log(item.id+ "!="+ $scope.mappedOrders[index]);
                if(item.id != $scope.mappedOrders[index] ){
                    $scope.multiple_del.push(item);}
                    console.log($scope.multiple_del);
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
// End of Container ********************************************************************************************************
