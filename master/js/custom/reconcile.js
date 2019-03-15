
App.factory('Reconcile', function($resource, $rootScope) {
	var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "invoice";

	//console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
	//console.log("InvoiceHistory endpoint: " + endpoint);

	return $resource(endpoint, {}, {
		query: {
			method: 'GET',
			params: {},
			isArray: false,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}
		},
		GetDetails: {
			  method: 'GET',
			  isArray: true,
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			  },
			  url: $rootScope.serverUrl + $rootScope.apiMCF +
				'InvoiceDetail/getInvoiceDetail?invoiceNumber=:invNum',
			  params: {
				invNum: '@_invNum'
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


App.controller('reconcileController', function($scope, $state, $window, $timeout,
	$filter, $interval, ngTableParams, ngDialog, Reconcile) {

		//console.log(localStorage.getItem('token'));
		$scope.successShow = false;
	  $scope.failShowGet = false;
	  $scope.uptsuccessShow = false;
	  $scope.spinnerShow = true;

		var today = new Date();
		$scope.curntDate = ($filter('date')(new Date(today), 'yyyy-MM-ddTHH:mm:ss'));
	  $scope.getyesterday =	today.setDate(today.getDate());
		$scope.yesterday =  ($filter('date')(new Date($scope.getyesterday),'yyyy-MM-ddTHH:mm:ss'))+'Z';
		$scope.splitSterday = $scope.yesterday.split("T");
		$scope.prvday = $scope.splitSterday[0];

		/*var data = Reconcile.query({paid : "true",sDate: 	$scope.prvday, eDate: 	$scope.prvday});

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
	           var ReconcileData = params.filter() ? $filter('filter')(data, params.filter()) : data;
	           $defer.resolve(ReconcileData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
	           params.total(ReconcileData.length); // set total for recalc pagination
	           }
	         });
	   }); */
	   
	   $scope.custom_filter = {};
	   $scope.keypress_cnt = 0;
	   $scope.cusomt_filter_promise = '';
	   $scope.custom_filter_enable = false;
	   
	   $scope.customFilterData = function(){
		  
		  console.log('in customFilterData');
		 
		  if($scope.keypress_cnt==0){
		 
		
		 
				if($scope.haspaid_val == true){
										
						if($scope.startDateval == undefined && $scope.endDateval == undefined){
						$scope.cusomt_filter_promise =  Reconcile.query({paid : "true",sDate: 	$scope.prvday, eDate: 	$scope.prvday});
												
						}
						else{
						$scope.cusomt_filter_promise =  Reconcile.query({paid : "true",sDate: 	$scope.startDateval, eDate:$scope.endDateval});
								
						}
				}
				else{
						
						 $scope.cusomt_filter_promise =  Reconcile.query({paid : $scope.haspaid_val});
						
				}	 
		 
		 
		 
		  console.log('in keypress_cnt before==>'+ $scope.keypress_cnt);
		  $scope.keypress_cnt++;
		  }
		  
		  console.log('in keypress_cnt after==>'+ $scope.keypress_cnt);
		  
		  
		  $scope.cusomt_filter_promise.$promise.then(function (data_reconcile) {
			  
		
		  var criteria = {}	;
		  
		  if($scope.custom_filter.id!='')
			 criteria.id =  $scope.custom_filter.id;		 
		  if($scope.custom_filter.amount!='')
			 criteria.amount =  $scope.custom_filter.amount;
		  if($scope.custom_filter.dueDate!='')
			 criteria.dueDate =  $scope.custom_filter.dueDate;
		  if($scope.custom_filter.invoiceDate!='')
			 criteria.invoiceDate =  $scope.custom_filter.invoiceDate;
		  if($scope.custom_filter.transDate!='')
			 criteria.transDate =  $scope.custom_filter.transDate;
		  if($scope.custom_filter.invoicePdfUrl!='')
			 criteria.invoicePdfUrl =  $scope.custom_filter.invoicePdfUrl;
		  if($scope.custom_filter.invNum!='')
			 criteria.invNum =  $scope.custom_filter.invNum;
		 
		 console.log('criteria==>'+angular.toJson(criteria));
		 //console.log('array==>'+angular.toJson(data_reconcile.data));
		 
		 var object_keys = Object.keys(criteria);
		  console.log('object_keys==>'+object_keys);
		 if(angular.equals({}, criteria) ){	
			 
			 $scope.custom_filter_enable = false; 
			 $scope.reconcileData  = [];
			 console.log('criteria check==>'+angular.toJson(criteria));
			 $scope.init($scope.haspaid_val);
	
		}		   
		else{			 
		 $scope.custom_filter_enable = true; 	
		 $scope.cusom_filter_data = $scope.gradeC = $filter('filter')(data_reconcile.data, criteria);
		 
		 //console.log('cusom_filter_data==>'+angular.toJson($scope.cusom_filter_data));
		  
		 $timeout(function(){
		  
		  $scope.overall_reconcileData  = [];
		  $scope.overall_reconcileData_fn = function(arr, chunkSize) {
			var groups = [], i;
			for (i = 0; i < arr.length; i += chunkSize) {
				groups.push(arr.slice(i, i + chunkSize));
			}
			return groups;
		 }
		 
		 $scope.overall_reconcileData = $scope.overall_reconcileData_fn($scope.cusom_filter_data,10);
		 console.log('cusom_filter_data chunk==>'+angular.toJson($scope.overall_reconcileData));
		  $scope.reconcileData  = $scope.overall_reconcileData[0];
		  $scope.totalItems     = $scope.cusom_filter_data.length;
		  console.log('totalItems==>'+$scope.totalItems);
				//angular.copy(data_reconcile.data, $scope.reconcileData)
		 },1000); 
			
		 }
		  
		
		  }); 
		  
		   
	   }
	   
	  
	   
	  

		// Onload function

		//get another portions of data on page changed
  $scope.pageChanged = function() {
	 
	 if($scope.custom_filter_enable ==false)
     $scope.init($scope.haspaid_val);
	 else{
	 console.log('custom_filter==>'+$scope.custom_filter);
	 $scope.reconcileData  = $scope.overall_reconcileData[$scope.currentPage-1];
	 }
	 
  };

  $scope.getReconcileData = function(promiseobj){
	  	promiseobj.$promise.then(function (data_reconcile) {
		  	$scope.reconcileData = [];
		  	$scope.totalItems = data_reconcile.pagination.overallRecord
				angular.copy(data_reconcile.data, $scope.reconcileData);
				$scope.spinnerShow = false;
			});
  }
		 $scope.currentPage = 1;
		 $scope.offset_val  = 0;
		 $scope.limit_val   = 10;
		 $scope.reconcileData = [];
		 $scope.init = function (user) {
			
			$scope.keypress_cnt = 0;
			
			if($scope.currentPage==1){
				  $scope.offset_val  = 0;

			}
			else{
				 $scope.offset_val  = ($scope.currentPage-1)*10;
			}
					console.log('startDate==>'+$scope.startDateval+':endDateval==>'+$scope.endDateval);
					$scope.haspaid_val = user;
					if(user == true || user == undefined){
								//alert($scope.startDateval +"   |   "+ $scope.endDateval);
								if($scope.startDateval == undefined && $scope.endDateval == undefined){
			 							var paidSterday =  Reconcile.query({paid : "true",sDate: 	$scope.prvday, eDate: 	$scope.prvday,offset:$scope.offset_val,limit:$scope.limit_val});
								 		$scope.getReconcileData(paidSterday);
								}
								else{
										var paidSterday =  Reconcile.query({paid : "true",sDate: 	$scope.startDateval, eDate: 	$scope.endDateval,offset:$scope.offset_val,limit:$scope.limit_val});
									 	$scope.getReconcileData(paidSterday);
								}
						}
						if(user == false){
								var dataNotpaid =  Reconcile.query({paid : "false",offset:$scope.offset_val,limit:$scope.limit_val});
								$scope.getReconcileData(dataNotpaid);
						}
			};

			$scope.init(true);
			// Onload function ends
			// toggle button onchange functions
			$('#tgl').change(function() {
					var paidval = $(this).prop('checked');
			  	$scope.saveToggleval = paidval;
						$scope.init(paidval);
		 });
		 // toggle button onchange functions ends

		 /* Default Datepicker Calender Starts */

			// year starts
			$scope.openedEdit = false;
			$scope.today = function() {

				$scope.dt1 = new Date();
				$scope.dt =	$scope.dt1.setDate($scope.dt1.getDate() - 1);
			};
			$scope.minval = new Date();
			$scope.today();

			$scope.clear = function() {
				$scope.dt = null;
			};
			// Disable weekend selection
			$scope.disabled = function(date, mode) {
				return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
			};
			$scope.toggleMin = function() {
				$scope.minDate = $scope.minDate ? null : new Date();
				//alert("mindate")
			};
			$scope.toggleMin();
			$scope.openAdd = function($event) {
				//alert("add")
				$event.preventDefault();
				$event.stopPropagation();

				$scope.openedAdd = true;
			};
			$scope.openEdit = function($event) {
				//alert( $event.currentTarget === this );
				console.log("PICKER");
				console.log($event.currentTarget === this);
				if (angular.element($event.currentTarget)) {
					$event.preventDefault();
					$event.stopPropagation();
					$scope.openedEdit = true;
					$timeout(function() {
						$scope.openedEdit = false;
					}, 3000);
				}
			};
			$scope.initDate = new Date('2016-15-20');
			$scope.formats = ['dd/MM/yyyy HH:mm:ss', 'dd-MMMM-yyyy', 'yyyy/MM/dd',
				'dd.MM.yyyy', 'shortDate'
			];
			$scope.format = $scope.formats[0];

			$scope.formatsEdit = ['dd/MM/yyyy HH:mm:ss', 'dd-MMMM-yyyy', 'yyyy/MM/dd',
				'dd.MM.yyyy', 'shortDate'
			];
			$scope.formatEdit = $scope.formatsEdit[0];

			$scope.datepickerOptions = {
				datepickerMode: "'day'",
				//minMode:"year",
				minDate: "minDate",
				//showWeeks:"false",
			};
/* Default Datepicker Calender ends */


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

$('#config-text').val("$('#demo').daterangepicker(" + JSON.stringify(options, null, '    ') + ", function(start, end, label) {\n  console.log(\"New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')\");\n});");
$scope.currentPage=1;
$('#config-demo').daterangepicker(options, function(start, end, label){

	//	console.log('New date range selected value: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ')');
		$scope.fromDate =  start.format('YYYY-MM-DD');
	  $scope.toDate = end.format('YYYY-MM-DD');
		var startOf   = ($filter('date')(new Date($scope.fromDate),'yyyy-MM-dd'));
		var endOf   = ($filter('date')(new Date($scope.toDate),'yyyy-MM-dd'));
		//console.log("date check");
	  //	console.log($scope.fromDate +"                 "+ $scope.toDate);
		console.log('$scope.fromDate==>'+$scope.fromDate);
		console.log('$scope.toDate==>'+$scope.toDate);
		console.log("in"+$scope.saveToggleval);
		
		if($scope.saveToggleval != false){
			//var getUSERDATA = Reconcile.query({paid: "true"});
				$scope.startDateval = startOf;
				$scope.endDateval = endOf;
				console.log("startOf " +startOf);
				console.log("endOf   " +endOf);
				$scope.init(true);
		}
		if($scope.saveToggleval == false){
			$scope.init(false);
		}
});

};
					/*DateRangePicker Calender ends*/
					
					
	/***************** Details Dialog ng dialog start **************************/
	  $scope.showInvoiceDetails = function(company_name, admin_name, invoiceObj) {
    $timeout(function() {
      console.log(invoiceObj.invNum);
      $scope.invNum = invoiceObj.invNum;
      $scope.invoiceObj = invoiceObj;
      var invoice_data = "";
      invoice_data = Reconcile.GetDetails({
        invNum: invoiceObj.invNum
      });
      $scope.invoiceData = [];

      invoice_data.$promise.then(function(data) {
        console.log("invoice_data");
        console.log(angular.toJson(data));
        $scope.invoiceData = data;

      });



      console.log(invoice_data);
      ngDialog.openConfirm({
        template: 'invoiceDetailId',
        className: 'ngdialog-theme-default custom-width',
        preCloseCallback: 'preCloseCallbackOnScope',
        scope: $scope
      }).then(function(value) {

      }, function(reason) {

      })

    }, 200);
  };
  
  $scope.subtotal = function() {
    $scope.subtot = $scope.invoiceObj.amount;
    return $scope.subtot;
  }
	/***************** Details Dialog ng dialog end **************************/

});

// End of Reconcile ends ********************************************************************************************************
