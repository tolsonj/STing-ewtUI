// Orders ********************************************************************************************************

App.factory('Orders', function($resource, $rootScope) {

	var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "orders";
	console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
	console.log("endpoint: " + endpoint);

	return $resource(endpoint, {}, {
		query: {
			method: 'GET',
			isArray: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}
		},
		// save: {method: 'POST', url: 'http://localhost:8090/customer/save', params: {}},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			},
			url: $rootScope.serverUrl + 'MCF_backend/orders',
			params: {}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			},
			url: $rootScope.serverUrl + 'MCF_backend/orders/:id',
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
			url: $rootScope.serverUrl + 'MCF_backend/orders/:id',
			params: {
				id: '@_id'
			}
		}
	});
});


App.controller('OrderController', function($scope, $state, $window, $timeout,
	$filter, $interval, ngTableParams, ngDialog, Orders, Customers, Sites, Drivers,
	Containers, ContainerSize, Company) {

	var today = new Date();
	$scope.curntDate = ($filter('date')(new Date(today), 'yyyy-MM-ddTHH:mm:ss'));

	$scope.successShow = false;
	$scope.failShow = false;
	$scope.failShowGet = false;
	$scope.uptsuccessShow = false;

	$scope.addorderinfo = {
		id: "",
		selectedcustomer: "",
		selectedsite: "",
		selectedaddr: "",
		selectedSize: "",
		orderDate: new Date(),
		minDate: $scope.curntDate,
		scheduleDate: new Date(),
		selectedService: "",
		instruction: ""
	};

	$scope.serviceList = [{
		'state': 'RTY'
	}, {
		'state': 'SWP'
	}, {
		'state': 'DEL'
	}, {
		'state': 'REL'
	},{
		'state': 'LLO'
	}];


	function compare(a, b) {
		if (Number(a.ID) > Number(b.ID))
			return -1;
		else if (Number(a.ID) < Number(b.ID))
			return 1;
		else
			return 0;
	}




	// $scope.minDate = '2015-12-01T22:22:55';
	var now = new Date();
	$scope.addorderinfo.orderDate = new Date(now.getFullYear(), now.getMonth(),
		now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
	$scope.addorderinfo.scheduleDate = new Date(now.getFullYear(), now.getMonth(),
		now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

		$scope.company = Company.query();
		var company_info = $scope.company;
		company_info.$promise.then(function(company_info) {
			$scope.company_id = company_info.id;
		});


	// var data = Orders.query({completedFilter: "false"});
	var data = Orders.query(function(res) {
		console.log("succ");
	}, function(error) {
		$scope.failShowGet = true;
	});
	//$scope.orderinfo.customerdata= Orders.query();

	//var custjsondata = Customers.query();

	data.$promise.then(function(data) {

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 25, // count per page
					filter: {

				//orderdata :'50'       // initial filter
			},
			sorting: {
        name: 'asc'     // initial sorting
    }
				}, {
							total: data.length, // length of data
							getData: function($defer, params) {
							// use build-in angular filter
							$scope.orderedData = params.filter() ?
							$filter('filter')(data, params.filter()) : data;
							$defer.resolve(	$scope.orderedData.slice((params.page() - 1) * params.count(),
							params.page() * params.count()));
							params.total(	$scope.orderedData.length); // set total for recalc pagination
							}
						});
	});


	// Onload function
 var init = function () {
	 $scope.loggedUser = [];
	 var getUSERDATA =  Orders.query();
	 getUSERDATA.$promise.then(function (getUSERDATA) {
		 angular.forEach(getUSERDATA, function(value, key){
				 $scope.loggedUser.push(value);
		 });

	 });
 };
 init();
 // Onload function ends

$scope.Timer =   $interval( function(){    $scope.reload_dispatch(); },300000);
	$scope.reload_dispatch = function() {
				data_reload = Orders.query();
				data_reload.$promise.then(function (data_new) {
						angular.extend(data, data_new);
						//  console.log("data to angular json::"+angular.toJson(data));
						console.log("data length::"+data.length);
						$scope.tableParams.total(data.length);
						$scope.tableParams.reload();
				});
	}




	$scope.getselectval = function(selectedItem) {

				//console.log(selectedItem.sites.length);
				$scope.sitedata = [];
				angular.forEach(selectedItem.sites, function(value, key) {
						$scope.siteaddr = value.id;
						angular.forEach($scope.sites, function(value1, key1) {
						if (value.id === value1.id) {
								$scope.sitedata.push(value1);
							}
						});
					});
					console.log($scope.sitedata);
					//$scope.addorderinfo.id = $scope.addorderinfo.selectedcustomer.id;
					$scope.addorderinfo.id = selectedItem.id;
	};


	$scope.getsiteId = function(selectedItem) {
			//alert(selectedItem.id);
			//$scope.addorderinfo.siteid = $scope.addorderinfo.selectedsite;
			$scope.addorderinfo.siteid = selectedItem.id;
		}
 /*$scope.getdriver = function () {
			$scope.addorderinfo.driverId = $scope.addorderinfo.selecteddriver.id;
		}*/


	$scope.getcustfn = function(selectedItem) {
		//console.log(selectedItem.sites.length);

		$scope.sitesEdit = [];
		angular.forEach(selectedItem.sites, function(value, key) {
			$scope.siteaddr = value.id;
			angular.forEach($scope.sites, function(value1, key1) {
				if (value.id === value1.id) {
					$scope.sitesEdit.push(value1);

				}
			});
		});
		console.log($scope.sitesEdit);
		//$scope.addorderinfo.id = $scope.addorderinfo.selectedcustomer.id;
		//$scope.addorderinfo.id = selectedItem.id;



		/*
	$scope.sitedataedit = [];
	angular.forEach(selectedItem.sites, function(value, key){
		$scope.siteaddr = value.id;
        angular.forEach($scope.sites, function(value1, key1) {
			if(value.id === value1.id){
				$scope.sitedataedit.push(value1);
			}
        });
    });
	console.log($scope.sitedataedit);
	//$scope.addorderinfo.id = $scope.addorderinfo.selectedcustomer.id;
	//$scope.addorderinfo.id = selectedItem.id;*/
	}

	$scope.getcontainerId = function() {
		//alert($scope.addorderinfo.selectedSize.id);
		$scope.addorderinfo.containerSizeId = $scope.addorderinfo.selectedSize.id;
	}
	getCustomerById = function(obj, id) {
		var found = null;
		angular.forEach(obj, function(item) {
			if (item.id == id) found = item;
		});
		return found;
	}
	$scope.getservice = function() {
		//alert($scope.addorderinfo.selectedService.state);
		$scope.addorderinfo.serviceType = $scope.addorderinfo.selectedService.state;

	}


	//add dialog
	$scope.addDialog = function() {

		if ($scope.orderform.$valid) {

			var newOrder = new Orders;
			newOrder.customerId = $scope.addorderinfo.id;


			if ($scope.addorderinfo.containerSizeId == undefined) {
				newOrder.containerSizeId = $scope.containersize[1].id;
			} else {
				newOrder.containerSizeId = $scope.addorderinfo.containerSizeId;
			}

			newOrder.instruction = $scope.addorderinfo.INSTRUCTION;
			newOrder.companyId =	$scope.company_id;
			newOrder.orderDate = ($filter('date')(new Date($scope.addorderinfo.orderDate),
				'yyyy-MM-ddTHH:mm:ss')) + "Z";
			newOrder.scheduleDate = ($filter('date')(new Date($scope.addorderinfo.scheduleDate),
				'yyyy-MM-ddTHH:mm:ss')) + "Z";

			console.log("Add OrderDate:" + newOrder.orderDate);
			console.log("Add scheduleDate:" + newOrder.containerSizeId);
			//newOrder.serviceType = $scope.addorderinfo.SERVICE_TYPE;


			if ($scope.addorderinfo.serviceType == undefined) {
								newOrder.serviceType = "DEL";
						} else {
							newOrder.serviceType = $scope.addorderinfo.serviceType;
						}
			newOrder.siteId = $scope.addorderinfo.siteid;
			//newOrder.driverId = "1"; //$scope.addorderinfo.driverId;
			console.log(angular.toJson(newOrder));
			newOrder.$save().then(function(response) {
				console.log(angular.toJson(response));
				var cust = getCustomerById($scope.customers, response.customer.id);
				var site = getCustomerById($scope.sites, response.site.id);
				var cont = getCustomerById($scope.containersize, response.containerSizeId);

				response.SERVICE_TYPE = response.serviceType;
				response.INSTRUCTION = response.instruction;
				response.COMPANY_ID = response.companyId;
				response.ORDER_DATE = response.orderDate;
				response.SCHEDULE_DATE = ($filter('date')(new Date(response.scheduleDate),
					'yyyy-MM-ddTHH:mm:ss')); //response.scheduleDate;
				console.log("Add response Scheduledate:" + response.scheduleDate);
				response.ID = response.id;
				if (cust != null) {
					response.NAME = cust.name
				}
				if (site != null) {
					response.SITE_NAME = site.name;
					response.SITE_STREET = site.street;
					response.SITE_CITY = site.city
				}
				if (cont != null) {
					response.CONTAINER_SIZE = cont.size
				}
				//if(driver!=null) {response.DRIVER_NAME=driver.name}

				//data.push(response);
				$scope.loggedUser.push(response);

				$scope.tableParams.reload();
				$scope.reload_dispatch();
				init();
				$scope.successShow = true;
				$timeout(function() {
					$scope.successShow = false;
					//$scope.errormsg = "green"
				}, 5000);

			}, function(reason) {
				$scope.failShowGet = true;
				$timeout(function() {
					$scope.failShowGet = false;
					//$scope.errormsg = "green"
				}, 5000);
			});



			//$scope.addorderinfo.id = "";
			$scope.addorderinfo.selectedcustomer = "";
			//$scope.addorderinfo.selecteddriver = "";
			$scope.addorderinfo.selectedsite = "";
			$scope.addorderinfo.selectedaddr = "";
			$scope.addorderinfo.selectedcity = "";
			//$scope.addorderinfo.selectedSize = "";
			//$scope.addorderinfo.orderDate = "";

			var now = new Date();
			$scope.addorderinfo.orderDate = new Date(now.getFullYear(), now.getMonth(),
				now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
			$scope.addorderinfo.scheduleDate = new Date(now.getFullYear(), now.getMonth(),
				now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
			//$scope.addorderinfo.orderDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.addorderinfo.SERVICE_TYPE = "";
			$scope.addorderinfo.INSTRUCTION = "";
			//console.log($scope.addorderinfo);

			//$scope.orderform.size.$dirty = false;
			$scope.orderform.cusname.$dirty = false;
			//$scope.orderform.drivername.$dirty = false;
			$scope.orderform.stname.$dirty = false;
			$scope.orderform.size.$dirty = false;
			//$scope.orderform.date.$dirty = false;
			$scope.orderform.servicetype.$dirty = false;
			$scope.orderform.instruction.$dirty = false;

		} else {


			$scope.orderform.cusname.$dirty = true;
			//$scope.orderform.drivername.$dirty = true;
			$scope.orderform.stname.$dirty = true;
			$scope.orderform.size.$dirty = true;
			//$scope.orderform.date.$dirty = true;
			$scope.orderform.instruction.$dirty = true;
			$scope.orderform.servicetype.$dirty = true;



		}
		//fetch all movies. Issues a GET to /api/moviesalert("done data");
	};


	//add dialog ends


	// Delete dialog starts

	$scope.deleteDialog = function(orderName) {
		$scope.getorderName = orderName;
		var row = this.$parent.user;
		ngDialog.openConfirm({
			template: 'deleteDialogId',
			className: 'ngdialog-theme-default',
			preCloseCallback: 'preCloseCallbackOnScope',
			scope: $scope
		}).then(function(value) {
			// Delete from database
			console.log('Delete');
			// deleted from browser

		//	var index = data.indexOf(row);
			var index = $scope.loggedUser.indexOf(row);

			row.$destroy({id: $scope.loggedUser[index].ID}).then(function(response) {
				console.log(response);
				$scope.loggedUser.splice(index, 1);

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


	// Delete  dialog ends


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
	        		 var dataId = $scope.multiple_del[i].ID;
	        		 var index = functiontofindIndexByKeyValue($scope.loggedUser, "ID", dataId);
	        		 //alert(index);
	             var orderDeleteInstance = new Orders;
	             angular.extend(orderDeleteInstance, $scope.multiple_del[i]);
	             orderDeleteInstance.$destroy({id:dataId}).then(function(response){
	             //   console.log(response);
	             }, function(error){
	                $scope.failShowGet = true;
	                $timeout(function() { $scope.failShowGet = false;}, 5000);
	             });
	             $scope.loggedUser.splice(index,1);
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
	       angular.forEach($scope.orderedData, function(item) {
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



	// Edit dialog starts
	$scope.editDialog = function(editable) {

			$interval.cancel($scope.Timer);

		var user = this.$parent.user;
		user.isEditing = editable;
		var index = data.indexOf(user);

		user.orderinfo = angular.extend({}, user);
		//user.orderinfo = {};
		user.orderinfo.ID = user.ID;
		if (user.customer) user.orderinfo.CUSTOMER_ID = user.customer.id;
		if (user.containersize) user.orderinfo.CONTAINER_SIZE_ID = user.containersize.id;
		if (user.site) user.orderinfo.SITE_ID = user.site.id;

		//user.orderinfo.ORDER_DATE = new Date(user.ORDER_DATE);
		if (user.SCHEDULE_DATE == null) {
			user.SCHEDULE_DATE = new Date();
			user.orderinfo.SCHEDULE_DATE = new Date(user.SCHEDULE_DATE);
		} else {
			user.orderinfo.SCHEDULE_DATE = new Date(user.SCHEDULE_DATE);
		}
		user.orderinfo.INSTRUCTION = user.INSTRUCTION;
		user.orderinfo.SERVICE_TYPE = user.SERVICE_TYPE;


		if(editable == false)
		{

			//$scope.relaod_dispatch();
			$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
		}

	};
	$scope.getcustid = function() {
		//alert(cusId.id);
		this.$parent.user.orderinfo.customer = cusId.id;
	}

	$scope.getsitenameId = function(getsitenameId) {
		//alert(getsitenameId.id);
		$scope.snameId = getsitenameId.id;
	}
	$scope.getcontID = function(getcontID) {
		//alert(getcontID);
		$scope.contId = getcontID;
	}

	$scope.saveDialog = function() {

		if (this.$parent.user.userForm.$valid) {

			var user = this.$parent.user;
			user.isEditing = false;
			user.orderinfo.isEditing = false;
			//var index = data.indexOf(user);
			var index =	$scope.loggedUser.indexOf(user);

			var order = new Orders;
			//order.id = user.orderinfo.ID;
			order.customerId = user.orderinfo.CUSTOMER_ID;
			//alert("cust "+user.orderinfo.CUSTOMER_ID)
			order.containerSizeId = $scope.contId; //1;
			order.instruction = user.orderinfo.INSTRUCTION;
			order.companyId = $scope.company_id;
			//order.orderDate = "2012-12-04 11:11:04";
			//order.orderDate =($filter('date')(new Date(user.orderinfo.ORDER_DATE),'yyyy-MM-dd HH:mm:ss'));
			order.scheduleDate = ($filter('date')(new Date(user.orderinfo.SCHEDULE_DATE),
				'yyyy-MM-ddTHH:mm:ss'));

			order.serviceType = user.orderinfo.SERVICE_TYPE;

			order.siteId = user.orderinfo.SITE_ID;
			//alert(user.orderinfo.SITE_ID)
			//order.driverId = user.orderinfo.DRIVER_ID ;
			console.log("Edit:" + angular.toJson(order));



			//order.$update(index);
			angular.extend(user, user.orderinfo);
			$scope.tableParams.reload();

			order.$update({
				id: $scope.loggedUser[index].ID
			}).then(function(response) {
				console.log("Response:" + angular.toJson(response));
				//response.CUSTOMER_ID = response.customer.id;
				response.CUSTOMER_ID = response.customerId;
				response.ID = response.id;
				response.INSTRUCTION = response.instruction;
				response.COMPANY_ID = response.companyId;
				//response.ORDER_DATE=response.orderDate;
				response.SCHEDULE_DATE = response.scheduleDate;
				response.SERVICE_TYPE = response.serviceType;
				response.SITE_ID = response.siteId;
				//response.DRIVER_ID =response.driverId;
				var cust = getCustomerById($scope.customers, response.customer.id);
				var site = getCustomerById($scope.sites, response.site.id);
				var cont = getCustomerById($scope.containersize, response.containerSize.id);
				//var driver = getCustomerById($scope.drivers,response.driver.id);

				if (cust) {
					response.NAME = cust.name;
				}
				if (site) {
					response.SITE_NAME = site.name;
					response.SITE_STREET = site.street;
					response.SITE_CITY = site.city;
				}
				if (cont) {

					response.CONTAINER_SIZE = cont.size;
				}
				//if(driver){response.DRIVER_NAME = driver.name;}
				angular.extend($scope.loggedUser[index], response);
				$scope.tableParams.reload();
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


		} else {
			this.$parent.user.submitted = true;
		}
	//};



	function compareName(a, b) {
		if (a.name < b.name)
			return -1;
		else if (a.name > b.name)
			return 1;
		else
			return 0;
	}

	//	$scope.reload_dispatch();
		$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);

		//   $scope.tableParams.reload();
		//var c = Customers.get({id:index});
		/*var order = new Orders;
		angular.extend(user.orderinfo, data[index]);
		order.$update({id:data[index].id}); */
		// Edit dialog ends
	};


	$scope.orders = Orders.query();
	$scope.customers = Customers.query({
		siteFilter: 'true'
	});
/*	$scope.customers.$promise.then(function(data) {
		data.sort(compareName);
	});*/



	$scope.sites = Sites.query();
/*	$scope.sites.$promise.then(function(data) {
		data.sort(compareName);
	});
*/

	$scope.sitesEdit = $scope.sites;
	$scope.drivers = Drivers.query();
	$scope.containers = Containers.query();
	$scope.containersize = ContainerSize.query();

	var container_info = $scope.containersize;
	container_info.$promise.then(function(container_info) {
		$scope.addorderinfo.selectedSize = container_info[1];
	});

	// Edit dialog ends

	var today = new Date();
	$scope.curntDate = ($filter('date')(new Date(today), 'dd/MM/yyyy HH:mm:ss'));

	// year starts
	$scope.openedEdit = false;
	$scope.today = function() {

		$scope.dt = new Date();
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

			console.log("if");
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
	//year ends



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
									    										var getUSERDATA = Orders.query();
																					getUSERDATA.$promise.then(function (getUSERDATA) {
																							angular.forEach(getUSERDATA, function(value, key){

																								var dateTime = value.SCHEDULE_DATE.split("T");//dateTime[0] = date, dateTime[1] = time
											 													$scope.schddate = dateTime[0];
																								var startOf   = ($filter('date')(new Date($scope.fromDate),'yyyy-MM-dd'));
																								var endOf   = ($filter('date')(new Date($scope.toDate),'yyyy-MM-dd'));
																								var schddate =  ($filter('date')(new Date($scope.schddate),'yyyy-MM-dd'));
																								if(schddate >= startOf && schddate <= endOf ){
																									console.log("if yes" + schddate +">=" + startOf +"&&" + schddate +"<=" + endOf);
																									console.log($scope.schddate);
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
