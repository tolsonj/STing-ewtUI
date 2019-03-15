/* ********************* Start of Dispatch****************************** */
App.factory('Dispatchs', function($resource) {
         return $resource('server/dispatch.json', {
        update: { method: 'PUT', params: {id: '@id'}
    }
    });
    // return $resource('server/Vehicles.json');
});
App.factory('DispatchsOrders', function($resource) {
         return $resource('server/dispatch-orders.json', {
        update: { method: 'PUT', params: {id: '@id'}
    }
    });
    // return $resource('server/Vehicles.json');
});

App.factory('OrdersPopUps', function($resource) {
         return $resource('server/orderspop.json', {
        update: { method: 'PUT', params: {id: '@id'}
    }
    });
    // return $resource('server/Vehicles.json');
});

App.controller('DispatchController', function($scope, $state, $window,  $filter, ngTableParams, ngDialog, Dispatchs,DispatchsOrders,OrdersPopUps)
	{
		//$scope.drivers = ['Berry John','Jack Bush','Michel Son','Louis Brito','Jerry Hop','Tim Sen','Rocky Ven','John Rock','William Son','Steven Ben','Benny Rick','Richward Ken','Glenven Tick','Rocky Brito','Norman Randy'];

        $scope.model = {
			selected:"",
			orderstype:{
						checkorder:false,
							checkswap:false,
							checkreturn:false,
							checkrelocation:false
						}
		};
		$scope.drivers=[{id:1,name:"Berry John"},{id:2,name:"Jack Bush"},{id:3,name:"Michel Son"},{id:4,name:"Louis Brito"},{id:5,name:"Jerry Hop"},{id:6,name:"Tim Sen"},{id:7,name:"Rocky Ven"},{id:8,name:"John Rock"},{id:9,name:"William Son"},{id:10,name:"Steven Ben"},{id:11,name:"Benny Rick"},{id:12,name:"Richward Ken"},{id:13,name:"Glenven Tick"},{id:14,name:"Rocky Brito"},{id:15,name:"Norman Randy"}]





  var popData = OrdersPopUps.query();

  popData.$promise.then(function (popData)
   {
		$scope.tableParamsOrdersPopup = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		filter: {
		//orderdata :'50'       // initial filter
		}
   }, {
		total: popData.length, // length of data
		getData: function($defer, params)
			{
				// use build-in angular filter
				var orderedData = params.filter() ?
				$filter('filter')(popData, params.filter()) : popData;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
				params.total(orderedData.length); // set total for recalc pagination

			}
	  });





   });

  /*
  $scope.orderwin = function () {
      //  console.log(index);
	 //	alert("done");

		  var left = screen.width/2 - 200
        , top = screen.height/2 - 250
        , popup = $window.open('/#/app/orderpopup', '', "top=" + top + ",left=" + left + ",width=600,height=600")
        , interval = 1000;
  };*/




     $scope.orderwin = function() {
		// alert(popData.length);
		ngDialog.openConfirm({
			template: 'orderpopup',
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




  $scope.viewmap = function () {
      //  console.log(index);
	//	alert("done");

		  var left = screen.width/2 - 200
        , top = screen.height/2 - 250
        , popup = $window.open('/popup', '', "top=" + top + ",left=" + left + ",width=600,height=600")
        , interval = 1000;
  };

  var data = Dispatchs.query();
   // watch for check all checkbox
   data.$promise.then(function (data)
   {
		$scope.tableParamsDriver = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		filter: {
		//orderdata :'50'       // initial filter
		}
   }, {
		total: data.length, // length of data
		getData: function($defer, params)
			{
				// use build-in angular filter
				var orderedData = params.filter() ?
				$filter('filter')(data, params.filter()) : data;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
				params.total(orderedData.length); // set total for recalc pagination

			}
	  });
   });


    var data1 = DispatchsOrders.query();
    data1.$promise.then(function (data1)
		{
			$scope.tableParamsOrders = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					typeval : ""

				}
			}, {
			total: data1.length, // length of data
			getData: function($defer, params)
			{
				// use build-in angular filter

				 var temp = angular.copy(data1);
				   var filteredData = $filter('filter')(temp,
					// This is the custom filter function
					function(val,idx){
					   // entered filter in column
					   var filt = params.filter();
					   if(filt && filt.typeval) {
						   var searchfilter = filt.typeval;
						   // split multiple filter comma separated
						   var filterKeys = searchfilter.split(',');
						   if(filterKeys) {
							   var ret = false;
							   // iterate multiple entered filter and return true for match
							   for(var key in filterKeys) {
								   var listVal = val.typeval;
								   // call trim to remove whitespace between search filter keys
								   ret = (listVal.indexOf(filterKeys[key].trim())) > -1 || ret;
							   }
							   return ret;
						   }
					   }
					   return true;

					});

					console.log(filteredData);
				var orderedData = params.filter() ?
				filteredData : data1;

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
				params.total(orderedData.length); // set total for recalc pagination
			}
			});


			$scope.chkOrderType=function()
			{
				var arr =[];

				if($scope.model.orderstype.checkorder == true)
				{
					arr.push("New Order");

				}

				if($scope.model.orderstype.checkswap == true)
				{
				arr.push("Swap");

				}
				if($scope.model.orderstype.checkreturn == true)
				{
				arr.push("Returns");


				}
				if($scope.model.orderstype.checkrelocation == true)
				{
					arr.push("Relocation");



				}
				$scope.tableParamsOrders.filter().typeval=arr.toString();
				$scope.tableParamsOrders.reload();
			}
			$scope.getIndexById=function(id,arr){
				for(var i=0;i<arr.length;i++){
					if(arr[i].id==id) return i;
				}

			}
			$scope.changedValue=function()
				{
					for(var i=0;i<data1.length;i++){
						for(var j=0;j<$scope.tableParamsOrders.data.length;j++){
							if(data1[i].id==$scope.tableParamsOrders.data[j].id){
								angular.extend(data1[i],$scope.tableParamsOrders.data[j]);
							}
						}
					}
					//alert("dd"+data1.length);
					var temp=angular.copy(data1);
					angular.forEach(temp, function(item) {
					//   alert(item.isChecked);
					if(item.isChecked == true)
					{
						item.group =  $scope.model.selected.name;
						var index1 = $scope.getIndexById(item.id,data1);
						data1.splice(index1,1);
						var index2 = $scope.getIndexById(item.id,$scope.tableParamsOrders.data);
						$scope.tableParamsOrders.data.splice(index2,1)



					// return item.show = ! item.show;

					}
					else
					{
						item.group = "";
					}
					});
					//$scope.tableParamsOrders.data=data1;
					$scope.tableParamsOrders.reload();
				}

			$scope.checkboxes = { 'checked': false, items: {} };
			// watch for check all checkbox
			$scope.$watch('checkboxes.checked', function(value)
				{
					angular.forEach($scope.users, function(item)
						{
							if (angular.isDefined(item.id))
							{
								$scope.checkboxes.items[item.id] = value;
							}
						});
				});
			// watch for data checkboxes
			$scope.$watch('checkboxes.items', function(values)
			{
				if ((unchecked != 0)) {
                $scope.checkboxes.checked = (checked == total);
            }
            if (!$scope.users)
			{
                return;
            }
            var checked = 0, unchecked = 0,
                total = $scope.users.length;
            angular.forEach($scope.users, function(item) {

                checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if ((unchecked != 0)) {

                $scope.checkboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
			}, true);



		});

    });



/* ********************* End of Dispatch****************************** */



/* ********************* Start of Order Popup ****************************** */
App.factory('OrdersPopUps', function($resource) {
         return $resource('server/orderspop.json', {
        update: { method: 'PUT', params: {id: '@id'}
    }
    });
    // return $resource('server/Vehicles.json');
});


App.controller('OrderpopupController', function($scope, $state, $window,  $filter, ngTableParams, ngDialog,DispatchsOrders, OrdersPopUps)
	{
		//$scope.drivers = ['Berry John','Jack Bush','Michel Son','Louis Brito','Jerry Hop','Tim Sen','Rocky Ven','John Rock','William Son','Steven Ben','Benny Rick','Richward Ken','Glenven Tick','Rocky Brito','Norman Randy'];


        $scope.model = {};

		$scope.drivers=[{id:1,name:"Berry John"},{id:2,name:"Jack Bush"},{id:3,name:"Michel Son"},{id:4,name:"Louis Brito"},{id:5,name:"Jerry Hop"},{id:6,name:"Tim Sen"},{id:7,name:"Rocky Ven"},{id:8,name:"John Rock"},{id:9,name:"William Son"},{id:10,name:"Steven Ben"},{id:11,name:"Benny Rick"},{id:12,name:"Richward Ken"},{id:13,name:"Glenven Tick"},{id:14,name:"Rocky Brito"},{id:15,name:"Norman Randy"}]


    var data1 = DispatchsOrders.query();
    data1.$promise.then(function (data1)
		{
			$scope.tableParamsOrders = new ngTableParams({
			page: 1,            // show first page
			count: 10,          // count per page
			filter: {
			//orderdata :'50'       // initial filter
				}
			}, {
			total: data1.length, // length of data
			getData: function($defer, params)
			{
				// use build-in angular filter
				var orderedData = params.filter() ?
				$filter('filter')(data1, params.filter()) : data1;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
				params.total(orderedData.length); // set total for recalc pagination
			}
			});

			$scope.changedValue=function(item)
				{
					//alert("dd"+data1.length);

					$scope.model.selected = item.name;
					angular.forEach(data1, function(item) {
					//   alert(item.isChecked);
					if(item.isChecked == true)
					{
						item.group =  $scope.model.selected;


					// return item.show = ! item.show;

					}
					else
					{
						item.group = "";
					}
					});
				}

			$scope.checkboxes = { 'checked': false, items: {} };
			// watch for check all checkbox
			$scope.$watch('checkboxes.checked', function(value)
				{
					angular.forEach($scope.users, function(item)
						{
							if (angular.isDefined(item.id))
							{
								$scope.checkboxes.items[item.id] = value;
							}
						});
				});
			// watch for data checkboxes
			$scope.$watch('checkboxes.items', function(values)
			{
				if ((unchecked != 0)) {
                $scope.checkboxes.checked = (checked == total);
            }
            if (!$scope.users)
			{
                return;
            }
            var checked = 0, unchecked = 0,
                total = $scope.users.length;
            angular.forEach($scope.users, function(item) {

                checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if ((unchecked != 0)) {

                $scope.checkboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
			}, true);



		});

    });



/* ********************* End of Orders popup ****************************** */
