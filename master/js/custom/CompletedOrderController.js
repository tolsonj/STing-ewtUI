
App.factory('CompletedOrders', function($resource, $rootScope) {
 // return $resource('http://127.0.0.1\:8080/apiMCF/orders/:id', { id: '@_id' }, {
	   // return $resource('server/order3.json', {
		  // return $resource('server/DispatchNewOrders.json', {

				// var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "orders";
				var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "orders";
				console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
				console.log("endpoint: " + endpoint);

      return $resource(endpoint, {  }, {
		query: {method: 'GET', isArray: true }
    });
});


App.controller('CompletedOrderController', function($scope, $state, $window,  $filter, ngTableParams, ngDialog, Orders, Customers, Sites, Drivers, Containers) {

$scope.addorderinfo = {
        id: "",
		selectedcustomer: "",
        selectedsite: "",
		selectedaddr: "",
        size: "",
		orderDate: new Date(),
        instruction: ""
        };

$scope.failShowGet = false;
		var now = new Date();
	$scope.addorderinfo.orderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
//$scope.date1 = $filter("date")(Date.now(), 'yyyy-MM-dd');
      //[{id:1,name:"Rock"},{id:2,name:"Glen"},{id:3,name:"Brito"},{id:4,name:"Jack"}]

$scope.completedata = Orders.query(function(response){

},function(reason){
$scope.failShowGet = true;
});
    var data = Orders.query({completedFilter: "true"});

	//$scope.orderinfo.customerdata= Orders.query();

  //var custjsondata = Customers.query();


	 // Onload function
	var init = function () {
		$scope.loggedUser = [];
		var getUSERDATA =  Orders.query({completedFilter:"true"});
		getUSERDATA.$promise.then(function (getUSERDATA) {
			angular.forEach(getUSERDATA, function(value, key){
					$scope.loggedUser.push(value);

					data.$promise.then(function (data) {
			 		$scope.tableParams = new ngTableParams({
			 		page: 1,            // show first page
			 		count: 10,          // count per page
			 		filter: {
			 		//orderdata :'50'       // initial filter
			 		}
			 	}, {
			 		total: $scope.loggedUser.length, // length of data
					getData: function ($defer, params) {
					$scope.data = params.sorting() ? $filter('orderBy')($scope.loggedUser, params.orderBy()) : $scope.loggedUser;
					$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					$defer.resolve($scope.data);
				}
			 		});
			    });

			});

		});
	};
	init();
	// Onload function ends


	/* DateRangePicker Calender starts */
														        $('#config-text').keyup(function() {
														          eval($(this).val());
														        });

														        $('.configurator input, .configurator select').change(function() {
														          updateConfig();
														        });

														        $('.demo i').click(function() {
														          $(this).parent().find('input').click();
														        });

														        $('#startDate').daterangepicker({
														          singleDatePicker: true,
														          startDate: moment().subtract(6, 'days')
														        });

														        $('#endDate').daterangepicker({
														          singleDatePicker: true,
														          startDate: moment()
														        });

														        updateConfig();

														        function updateConfig() {
														          var options = {};

														          if ($('#ranges').is(':checked')) {
														            options.ranges = {
														              'Today': [moment(), moment()],
														              'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
														              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
														              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
														              'This Month': [moment().startOf('month'), moment().endOf('month')],
														              'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
														            };
														          }

														          if (!$('#linkedCalendars').is(':checked'))
														            options.linkedCalendars = false;
														          if ($('#alwaysShowCalendars').is(':checked'))
														            options.alwaysShowCalendars = true;

														          $('#config-text').val("$('#demo').daterangepicker(" + JSON.stringify(options, null, '    ') + ", function(start, end, label) {\n  console.log(\"New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')\");\n});");

																			$('#config-demo').daterangepicker(options, function(start, end, label){
																					console.log('New date range selected value: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ')');
										 											$scope.fromDate =  start.format('YYYY-MM-DD');
										 										  $scope.toDate = end.format('YYYY-MM-DD');
																					console.log($scope.fromDate +"                 "+ $scope.toDate);
																					$scope.loggedUser = [];
									    										var getUSERDATA = Orders.query({completedFilter:"true"});
																					getUSERDATA.$promise.then(function (getUSERDATA) {
																							angular.forEach(getUSERDATA, function(value, key){
																								var dateTime = value.ORDER_DATE.split("T");//dateTime[0] = date, dateTime[1] = time
											 													$scope.orddate = dateTime[0];
																								var startOf   = ($filter('date')(new Date($scope.fromDate),'yyyy-MM-dd'));
																								var endOf   = ($filter('date')(new Date($scope.toDate),'yyyy-MM-dd'));
																								var orddate =  ($filter('date')(new Date($scope.orddate),'yyyy-MM-dd'));
																								if(orddate >= startOf && orddate <= endOf ){
																									console.log("if yes" + orddate +">=" + startOf +"&&" + orddate +"<=" + endOf);
																									console.log($scope.orddate);
																									$scope.loggedUser.push(value);
																									console.log("GETDAT");
																									console.log($scope.loggedUser);
																								}
																							});
																						});
																			});
														      };
						/*DateRangePicker Calender ends*/


    });



// End of Orders ********************************************************************************************************
