App.controller('exportBOLController', function($scope, $state, $window, $timeout, $filter, $interval, ngTableParams,
	ngDialog, signService) {

	//console.log(localStorage.getItem('token'));
	$scope.successShow = false;
	$scope.failShowGet = false;
	$scope.uptsuccessShow = false;
	$scope.spinnerShow = true;
	// set current week filters date

	$scope.fromDate = ($filter('date')(new Date(moment().startOf('month')), 'yyyy-MM-dd'));
	$scope.toDate = ($filter('date')(new Date(moment().endOf('month')), 'yyyy-MM-dd'));


	$scope.BOL_list_table = function(item) {

		console.log('item==>' + item);

		if (item != undefined)
			$scope.driverName = item;


		if ($scope.currentPage == 1) {
			$scope.offset_val = ($scope.currentPage - 1) * 20
		}


		var params = {};

		if ($scope.driverName != undefined && $scope.driverName != 'All' && $scope.driverName != '')
			params.driverName = $scope.driverName;

		if ($scope.fromDate != null && $scope.toDate != null) {

			params.serviceFrom = $scope.fromDate;
			params.serviceTo = $scope.toDate;

		}


		params.limit = 10000;

		if ($scope.orderByColumn != null)
			params.orderBy = $scope.orderByColumn;

		if ($scope.orderType != null)
			params.type = $scope.orderType;


		console.log("params bol.query: " + angular.toJson(params));
		var bol_list = signService.query(params);

		$scope.getBolHistoryData(bol_list);


	};

	$scope.getBolHistoryData = function(promiseobj) {
		promiseobj.$promise.then(function(data_history) {
			$scope.bol_list_table = [];
			$scope.totalItems = 0;
			//$timeout(function(){
			$scope.totalItems = data_history.count;

			angular.copy(data_history.data, $scope.bol_list_table);
			console.log('bol_list_table==>' + angular.toJson($scope.bol_list_table));
			$scope.spinnerShow = false;
			//$scope.onLoadspinnerShow = false;
			//},100);
		});
	};


	$scope.driverList = [];
	signService.getDriverList(function(res) {

		$scope.driverList = res.drivers;
		$scope.driverList.push('All');

		console.log("driverList:", res);
		//alert(res.drivers);
		//alert("isArray:" + isArray($scope.driverList));

	}, function(error) {
		$scope.failShowGet = true;
		//$timeout(function() { $scope.failShowGet = false;}, 5000);
	});


	$scope.custom_filter = {};
	$scope.keypress_cnt = 0;
	$scope.cusomt_filter_promise = '';
	$scope.custom_filter_enable = false;
	$scope.currentPage = 1;
	$scope.offset_val = 0;
	$scope.limit_val = 10;
	$scope.reconcileData = [];



	$scope.init = function(user) {
		$scope.keypress_cnt = 0;

		$scope.BOL_list_table();
	};



	$scope.init(true);
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

	updateConfig();
	$('#config-demo').data('daterangepicker').setStartDate(moment().startOf('month'));
	$('#config-demo').data('daterangepicker').setEndDate(moment().endOf('month'));

	function updateConfig(ngTableParams) {
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

		$('f').val("$('#demo').daterangepicker(" + JSON.stringify(options, null, '    ') +
			", function(start, end, label) {\n  console.log(\"New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')\");\n});"
		);
		$scope.currentPage = 1;
		$('#config-demo').daterangepicker(options, function(start, end, label) {

			//	console.log('New date range selected value: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ')');
			$scope.fromDate = start.format('YYYY-MM-DD');
			$scope.toDate = end.format('YYYY-MM-DD');
			var startOf = ($filter('date')(new Date($scope.fromDate), 'yyyy-MM-dd'));
			var endOf = ($filter('date')(new Date($scope.toDate), 'yyyy-MM-dd'));

			console.log('$scope.fromDate==>' + $scope.fromDate);
			console.log('$scope.toDate==>' + $scope.toDate);


			$scope.init(true);

		});

	};



	/***************** Details Dialog ng dialog end **************************/

});


App.directive('exportToCsv', function() {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			function stringify(str) {
				return '"' + str.replace(/^\s\s*/, '').replace(/\s*\s$/, '').replace(/"/g, '""') + '"';
			}
			var el = element[0];
			element.bind('click', function(e) {
				var table = e.target.nextElementSibling;
				var csvString = '';
				for (var i = 0; i < table.rows.length; i++) {
					var rowData = table.rows[i].cells;
					for (var j = 0; j < rowData.length; j++) {
						if (rowData[j].innerHTML.indexOf('<a href') > -1) {
							var ele = angular.element(rowData[j]);
							for (var k = 0; k < ele[0].childNodes.length; k++) {
								if (ele[0].childNodes[k].tagName == 'A') {
									csvString = csvString + stringify(ele[0].childNodes[k].innerText) + ",";
								}
							}
						} else if (rowData[j].innerHTML.indexOf('<em') > -1 || rowData[j].innerHTML.indexOf('<strong>') > -1) {
							var ele = angular.element(rowData[j]);
							csvString = csvString + stringify(ele[0].textContent) + ",";
						} else {
							csvString = csvString + stringify(rowData[j].innerHTML) + ",";
						}
					}
					csvString = csvString.substring(0, csvString.length - 1);
					csvString = csvString + "\n";
				}
				console.log(csvString);
				csvString = csvString.substring(0, csvString.length - 1);
				// alert(csvString);
				var a = $('<a/>', {
					style: 'display:none',
					href: 'data:application/csv;base64,' + btoa(csvString),
					download: 'bolExport.csv'
				}).appendTo('body')
				a[0].click()
				a.remove();
			});
		}
	}
});
// End of Reconcile ends ********************************************************************************************************
