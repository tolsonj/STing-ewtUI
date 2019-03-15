

App.factory('Vehicles', function($resource,$rootScope) {
    // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "vehicles";
    var endpoint = $rootScope.serverUrl  + $rootScope.apiMCF + "vehicles";

    //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
    //console.log("endpoint: " + endpoint);

    return $resource(endpoint, {}, {
		query: {
			method: 'GET', params: {},
			isArray: true,
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
			},
        save: {
			method: 'POST',
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/vehicles',
			params: {}
			},
		update: {
			method: 'PUT',
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/vehicles/:id',
			params: {id: '@_id'}
		},
		destroy: {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
			url: $rootScope.serverUrl + 'MCF_backend/vehicles/:id',
			params: {id: '@_id'}
			}
  });
});

App.directive('noSpecialChar', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == undefined)
            return ''
          cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  });

App.controller('VehicleController', function($rootScope, $scope, $state, $window, $filter, Flash, ngTableParams, ngDialog, Vehicles, Company, $timeout) {
    $scope.addvehicleInfo = {
		id: "",
      name: "",
      description: "",
      year: "",
      make : "" ,
      model: ""
    };
	$scope.successShow = false;
	$scope.failShowGet = false;
  $scope.uptsuccessShow = false;
    $scope.editDialog = function (editable) {

	 var vehicle = this.$parent.vehicle;
			vehicle.isEditing = editable;
			var index = data.indexOf(vehicle);

			vehicle.vehicleInfo = {};
			vehicle.vehicleInfo.id = vehicle.id;
			vehicle.vehicleInfo.name = vehicle.name;
			vehicle.vehicleInfo.description = vehicle.description;
			vehicle.vehicleInfo.year = vehicle.year;
			vehicle.vehicleInfo.make = vehicle.make;
			vehicle.vehicleInfo.model = vehicle.model;
			vehicle.vehicleInfo.color = vehicle.color;
			vehicle.vehicleInfo.stateRegistered = vehicle.stateRegistered;
			vehicle.vehicleInfo.tag = vehicle.tag;

	};

	$scope.saveDialog = function () {
		if(this.$parent.vehicle.userForm.$valid)
		{
			var vehicle = this.$parent.vehicle;
			vehicle.isEditing = false;
			var index = data.indexOf(vehicle);

			vehicle.id = vehicle.vehicleInfo.id;
			vehicle.name = vehicle.vehicleInfo.name;
			vehicle.description = vehicle.vehicleInfo.description;
			vehicle.year = vehicle.vehicleInfo.year;
			vehicle.make = vehicle.vehicleInfo.make;
			vehicle.model = vehicle.vehicleInfo.model;
			vehicle.color = vehicle.vehicleInfo.color;
			vehicle.stateRegistered = vehicle.vehicleInfo.stateRegistered;
			vehicle.tag = vehicle.vehicleInfo.tag;
      vehicle.company = $scope.company_id;
			//console.log(angular.toJson(vehicle.vehicleInfo));
			$scope.tableParams.reload();

			var vehicleUpdateInstance = new Vehicles;
			angular.extend(vehicleUpdateInstance, data[index]);
			vehicleUpdateInstance.$update({id:data[index].id}).then(function(response){
                $scope.uptsuccessShow = true;
        				$timeout(function() {$scope.uptsuccessShow = false;}, 5000);
      },function(error){
        $scope.failShowGet = true;
			  $timeout(function() { $scope.failShowGet = false;}, 5000);
      });
		}
		else
		{

			this.$parent.vehicle.submitted = true;
		}
			/*
				var vehicleUpdateInstance = new Vehicles
				angular.extend(vehicleUpdateInstance, data[index]);
				vehicleUpdateInstance.$update({id:data[index].id});*/
	 };

$scope.deleteDialog = function (vehName) {
	$scope.getvehName = vehName;
	var row = this.$parent.vehicle;
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

	     var vehicleDeleteInstance = new Vehicles;
		angular.extend(vehicleDeleteInstance, data[index]);
		vehicleDeleteInstance.$destroy({id:data[index].id}).then(function(response){
      // console.log(response);
    }, function(error){
          $scope.failShowGet = true;
			    $timeout(function() { $scope.failShowGet = false;}, 5000);
    });


       data.splice(index,1);
       $scope.tableParams.reload();


/*       Vehicles.delete({id: data[index].id});
       data.splice(index,1);
       $scope.tableParams.reload();
*/
       // need a call to delete to the backend
    }, function (reason) {
      console.log('Cancel');
    });
  };

$scope.addDialog = function () {
	if($scope.vehicleForm.$valid)
	{
	 	  var newVehicles = new Vehicles;
      newVehicles.company = $scope.company_id;
		  angular.extend(newVehicles, $scope.addvehicleInfo);
		  //console.log(angular.toJson(newVehicles));
		  newVehicles.$save().then(function(response){
			//console.log("Response:"+angular.toJson(response));
			data.push(response);
			$scope.tableParams.reload();
      $scope.successShow = true;
  		$timeout(function () { $scope.successShow = false; },5000);
		}, function(reason) {
      $scope.failShowGet = true;
  			 $timeout(function() { $scope.failShowGet = false;}, 5000);
		});



		    $scope.addvehicleInfo.id = "";
        $scope.addvehicleInfo.name = "";
        $scope.addvehicleInfo.description = "";
        $scope.addvehicleInfo.year = "";
        $scope.addvehicleInfo.make = "";
        $scope.addvehicleInfo.model = "";
		    $scope.addvehicleInfo.color = "";
		    $scope.addvehicleInfo.stateRegistered = "";
		    $scope.addvehicleInfo.tag = "";

		$scope.vehicleForm.name.$dirty = false;
		$scope.vehicleForm.desc.$dirty = false;
		$scope.vehicleForm.year.$dirty = false;
		$scope.vehicleForm.make.$dirty = false;
		$scope.vehicleForm.model.$dirty = false;
		$scope.vehicleForm.color.$dirty = false;
		$scope.vehicleForm.stateRegistered.$dirty = false;
		$scope.vehicleForm.tag.$dirty = false;

		//Add success messsage
		     //var message = '<strong>Vehicles added successfully.<strong>';
        //Flash.create('success', message);
		//Add success messsage ends
	}
	else
	{
		$scope.vehicleForm.name.$dirty = true;
		$scope.vehicleForm.desc.$dirty = true;
		$scope.vehicleForm.year.$dirty = true;
		$scope.vehicleForm.make.$dirty = true;
		$scope.vehicleForm.model.$dirty = true;
		$scope.vehicleForm.color.$dirty = true;
		$scope.vehicleForm.stateRegistered.$dirty = true;
		$scope.vehicleForm.tag.$dirty = true;

	}
  };


    $scope.company = Company.query();
    var company_info = $scope.company;
    company_info.$promise.then(function(company_info){
       $scope.company_id =  company_info.id;
       //console.log($scope.company_id);
    });

    var data = Vehicles.query(function(res){
      console.log("success");
    },function(error){
      $scope.failShowGet = true;
      //$timeout(function() { $scope.failShowGet = false;}, 5000);
    });
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
           $scope.vehiceData = params.filter() ? $filter('filter')(data, params.filter()) : data;
           $defer.resolve($scope.vehiceData .slice((params.page() - 1) * params.count(),  params.page() * params.count()));
           params.total($scope.vehiceData .length); // set total for recalc pagination

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
             var vehicleDeleteInstance = new Vehicles;
             angular.extend(vehicleDeleteInstance, $scope.multiple_del[i]);
             vehicleDeleteInstance.$destroy({id:dataId}).then(function(response){
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
       angular.forEach($scope.vehiceData, function(item) {
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
// End of Vehicles ********************************************************************************************************
// To show flash message starts
(function () {
    'use strict';
    var app = angular.module('flash', []);

    app.run(function ($rootScope) {
        // initialize variables
        $rootScope.flash = {};
        $rootScope.flash.text = '';
        $rootScope.flash.type = '';
        $rootScope.flash.timeout = 5000;
        $rootScope.hasFlash = false;
    });

    // Directive for compiling dynamic html
    app.directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function (html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    });

    // Directive for closing the flash message
    app.directive('closeFlash', function ($compile, Flash) {
        return {
            link: function (scope, ele, attrs) {
                ele.on('click', function () {
                    Flash.dismiss();
                });
            }
        };
    });

    // Create flashMessage directive
    app.directive('flashMessage', function ($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div>',
            link: function (scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    });

    app.factory('Flash', ['$rootScope', '$timeout',

    function ($rootScope, $timeout) {

        var dataFactory = {},
        num = 0,
            timeOut,
            canceled = false;


        // Create flash message
        dataFactory.create = function (type, text, addClass) {
            $rootScope.flash.type = type;
            $rootScope.flash.text = text;
            $rootScope.flash.addClass = addClass;
            canceled = false;
            $timeout(function () {
                $rootScope.hasFlash = true;
            }, 100);
            num++;
            timeOut = $timeout(function () {
                if (canceled === false) {
                    if (num == 1) {
                        $timeout(function () {
                            $rootScope.hasFlash = false;
                        });
                    }
                    num--;
                }
            }, $rootScope.flash.timeout);
        };

        // Cancel flashmessage timeout function
        dataFactory.pause = function () {
            num = 0;
            $timeout.cancel(timeOut);
            canceled = true;
        };

        // Dismiss flash message
        dataFactory.dismiss = function () {
            $timeout.cancel(timeOut);
            canceled = true;
            num = 0;
            $timeout(function () {
                $rootScope.hasFlash = false;
            });
        };
        return dataFactory;
    }]);
}());

// To show flash message ends
