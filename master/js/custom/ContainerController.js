// Containers ********************************************************************************************************
/*
App.factory('Containers', function($rootScope,$resource) {
    //return $resource('http://127.0.0.1\:8080/apiMCF/containers/:id', { id: '@_id' }, {
	  return $resource($rootScope.app.backendURL + 'Container', {
	  update: { method: 'PUT', params: {id: '@id'}}
  });
});
*/

/*App.factory('Containers', function($resource, $rootScope) {
    var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers/:id";
    console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
    console.log("endpoint: " + endpoint);

    return $resource(endpoint, { id: '@_id' }, {
    update: { method: 'PUT', params: {id: '@id'}}
  });
});
*/

App.factory('Containers', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "containers";
  // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("container endpoint: " + endpoint);

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      params: {},
      isArray: true,
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
      url: endpoint,
      params: {}
    },
    update: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: endpoint + '/:id',
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
      url: endpoint + '/:id',
      params: {
        id: '@_id'
      }
    }
  });
});

App.controller('ContainerController', function($scope, $state, $window,
  $timeout, ngDialog, $filter, ngTableParams, Containers, Company) {
  $scope.addcontainerInfo = {
    id: "",
    size: "",
    description: ""
  };
  $scope.successShow = false;
  $scope.failShowGet = false;
  $scope.uptsuccessShow = false;

  $scope.company = Company.query();
  var company_info = $scope.company;
  company_info.$promise.then(function(company_info) {
    $scope.company_id = company_info.id;
  //  console.log($scope.company_id );
  });



  var data = Containers.query(function(res) {
    console.log("success");
    //console.log(res);
  }, function(error) {
    $scope.failShowGet = true;
    console.log("error");
    //console.log(error);
  });

  $scope.editDialog = function(editable) {
    var container = this.$parent.container;
    container.isEditing = editable;
    var index = data.indexOf(container);


	  container.containerInfo = {};
	  container.containerInfo.id = container.id;
	  container.containerInfo.size = container.size;
    container.containerInfo.identifier = container.identifier;
    container.containerInfo.status = {description : container.status.description};


    $scope.tableParams.reload();
  };

  $scope.saveDialog = function () {
	if(this.$parent.container.userForm.$valid)
		{
			var container = this.$parent.container;
			container.isEditing = false;
			var index = data.indexOf(container);

			container.id = container.containerInfo.id;
			container.size = container.containerInfo.size;
      container.identifier = container.containerInfo.identifier;
      container.company = $scope.company_id;
			//user.container = {size : user.orderinfo.container.size};
			container.status = {id:container.containerInfo.status.id,description : container.containerInfo.status.description};
			console.log("Edit:"+angular.toJson(container.containerInfo));
			$scope.tableParams.reload();

			var containerUpdateInstance = new Containers;
			angular.extend(containerUpdateInstance, data[index]);
			containerUpdateInstance.$update({id:data[index].id}).then(function(response) {

        //console.log("response");
        $scope.uptsuccessShow = true;
        $timeout(function() {
          $scope.uptsuccessShow = false;
        }, 5000);
      }, function(error) {
        $scope.failShowGet = true;
        $timeout(function() {
          $scope.failShowGet = false;
        }, 5000);
      });

		}
	else
		{
			this.$parent.container.submitted = true;
		}
			/* var containerUpdateInstance = new Containers
      angular.extend(containerUpdateInstance, data[index]);
      containerUpdateInstance.$update({id:data[index].id});
		 */
	  };

	$scope.addDialog = function () {
      // Reset container object
	if($scope.containerForm.$valid)
	 {

	  var newContainer = new Containers;
     // angular.extend(newContainer, $scope.addcontainerInfo);
	  //newContainer.id = $scope.addcontainerInfo.id;
	  newContainer.size = $scope.addcontainerInfo.size;
    newContainer.identifier = $scope.addcontainerInfo.identifier;
    newContainer.company = $scope.company_id;
	 // newOrder.container = {size:$scope.addorderinfo.size};
	 // newContainer.status = {id:$scope.addcontainerInfo.status.id,description:$scope.addcontainerInfo.status.description};
	  newContainer.status = {id:'1',description:$scope.addcontainerInfo.status.description};
    console.log("newContainer.status");
    console.log(newContainer.status);
	  //console.log("Add:"+angular.toJson(newContainer));
      newContainer.$save().then(function(response){
			console.log("Response:"+angular.toJson(response));
			data.push(response);
			$scope.tableParams.reload();
      $scope.successShow = true;
      $timeout(function() {$scope.successShow = false;}, 5000);

	  }, function(reason) {
      $scope.failShowGet = true;
      $timeout(function() { $scope.failShowGet = false;}, 5000);
		});


      $scope.addcontainerInfo.id = "",
      $scope.addcontainerInfo.size = "";
      $scope.addcontainerInfo.identifier = "";
      $scope.addcontainerInfo.status.description = "";

	    $scope.containerForm.size.$dirty = false;
	    $scope.containerForm.desc.$dirty = false;
      $scope.containerForm.identifier.$dirty = false;

   }
   else
   {

	    $scope.containerForm.size.$dirty = true;
		  $scope.containerForm.desc.$dirty = true;
      $scope.containerForm.identifier.$dirty = true;
   }
};


  $scope.deleteDialog = function(contSize) {
    $scope.getcontSize = contSize;
    var row = this.$parent.container;
    ngDialog.openConfirm({
      template: 'deleteDialogId',
      className: 'ngdialog-theme-default',
      preCloseCallback: 'preCloseCallbackOnScope',
      scope: $scope
    }).then(function(value) {
      // Delete from database
      console.log('Delete');
      // deleted from browser
      var index = data.indexOf(row);
      var containerDeleteInstance = new Containers;
      angular.extend(containerDeleteInstance, data[index]);
      containerDeleteInstance.$destroy({
        id: data[index].id
      }).then(function(response) {
        data.splice(index, 1);
        console.log(index);
        $scope.tableParams.reload();

      }, function(error) {
        $scope.failShowGet = true;
        $timeout(function() {
          $scope.failShowGet = false;
        }, 5000);
      });

      // need a call to delete to the backend
    }, function(reason) {
      console.log('Cancel');

    });
  };

  // watch for check all checkbox
  data.$promise.then(function(data) {
    $scope.tableParams = new ngTableParams({
      page: 1, // show first page
      count: 10, // count per page
      filter: {
        // status:'H'       // initial filter
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        $scope.containerData = params.filter() ? $filter('filter')(
          data, params.filter()) : data;
        $defer.resolve($scope.containerData.slice((params.page() - 1) *
          params.count(), params.page() * params.count()));
        params.total($scope.containerData.length); // set total for recalc pagination

      }
    });
  });



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
              var containerDeleteInstance = new Containers;
              angular.extend(containerDeleteInstance, $scope.multiple_del[i]);
              containerDeleteInstance.$destroy({id:dataId}).then(function(response){
                //console.log(response);
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
        angular.forEach($scope.containerData, function(item) {
             console.log("item");console.log(item);
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
            console.log("$scope.checkboxes.checked");
            console.log($scope.checkboxes.checked);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
        $scope.deleteSelectedRows();
    }, true);

  /*Selecet all rows and delete code ends*/

});
// End of Container ********************************************************************************************************
