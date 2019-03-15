/* *********************** DispatchNew Starts ************************* */

App.factory('DispatchesNew', function($resource, $rootScope) {

				var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "orders";
				console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
				console.log("endpoint: " + endpoint);

      return $resource(endpoint, {  }, {
		query: {method: 'GET', isArray: true }
    });
});

App.controller('OrderDispatchController', function($scope, $state, $window,$localStorage,$sessionStorage,$cookieStore,$timeout,$interval,  $filter, ngTableParams, ngDialog, Orders, Customers, Drivers, Vehicles, Sites, Containers, ContainerSize, Landfills, Company) {
$scope.drivercount =0;
var order_id_to_update, onloadDriverid, data_reload;
$scope.successShow = false; $scope.uptsuccessShow = false; $scope.failShowGet = false;
var now = new Date();
$scope.nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

$scope.scheduleFilter = function(user) {
		var sch_date   = new Date(user.SCHEDULE_DATE);
		$scope.todayDate = new Date(); //Today Date
		var myday = new Date();
		var tomo = myday.setDate(myday.getDate() + 1);
		return sch_date <= tomo;
};
/* Tomo date validation for Schedule date line break*/
$scope.myday = new Date();
$scope.tomo = $scope.myday.setDate($scope.myday.getDate() + 1);
$scope.setTomo =  ($filter('date')(new Date($scope.tomo),'yyyy-MM-ddTHH:mm:ss'))+'Z';
/*Tomo date validation for Schedule date line break ends */
$scope.company = Company.query();
var company_info = $scope.company;
company_info.$promise.then(function(company_info) {
	$scope.company_id = company_info.id;
});



$scope.dispatchorder = Orders.query(function(response){ },function(reason){ $scope.failShowGet = true; });

var data = Orders.query({completedFilter : "false"});
$scope.counttomo = [];
$scope.countcur = [];
$scope.countpast = [];
$scope.clicktomoDate=0;
$scope.clickcurDate=0;
$scope.clickpastDate=0;
var init = function () {
	var getUSERDATA =  Orders.query({completedFilter : "false"});
	getUSERDATA.$promise.then(function (getUSERDATA) {
		 angular.forEach(data, function(value, key){
			 var sch_date   = new Date(value.SCHEDULE_DATE);
			 $scope.myday = new Date();
			 $scope.schdate =  ($filter('date')(new Date(value.SCHEDULE_DATE),'yyyy-MM-dd'));
			 $scope.curdate = ($filter('date')(new Date($scope.myday),'yyyy-MM-dd'));
			 $scope.tomorrow = $scope.myday.setDate($scope.myday.getDate() + 1);
			 $scope.setTomo =  ($filter('date')(new Date($scope.tomorrow),'yyyy-MM-dd'));
				//console.log($scope.schdate + " :::  "+  $scope.curdate);
					 if($scope.schdate === $scope.setTomo) {
								 $scope.counttomo.push(value);
								 $scope.clicktomoDate++;
								// console.log("IN LOOP SCHE  "+ 	$scope.clicktomoDate );
					 }
					 if($scope.schdate < $scope.curdate) {
								 $scope.countpast.push(value);
								 $scope.clickpastDate++;
							//	 console.log("IN LOOP SCHE past  "+ 	$scope.clickpastDate );
					 }
					 if($scope.schdate === $scope.curdate) {
								 $scope.countcur.push(value);
								 $scope.clickcurDate++;
							//	 console.log("IN LOOP SCHE curr  "+ 	$scope.clickcurDate );
					 }
			});
		});
};
init();

data.$promise.then(function (data) {
			 $scope.tableParams = new ngTableParams({
				 		page: 1,            // show first page
				 	  count: 10000 ,          // count per page
				 		filter: {	}
			 }, {
				 counts: [],
				 total: data.length, // length of data
				 getData: function($defer, params) {
				 		// use build-in angular filter
				 		var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;
				 		$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
				 		params.total(orderedData.length); // set total for recalc pagination
				 		$timeout(function(){
						 		if($('.circle').hasClass('sky_blue_border')){
						 				$('.sky_blue_border').draggable();
						 				$(".sky_blue_border").draggable("disable");
						 		}
									var x=$scope.clickpastDate;
									var y=$scope.clickcurDate+x;
									var z=$scope.clicktomoDate+y;
								//	$("#sortable tr:nth-of-type("+x+"n)").addClass("odd");
									$("#sortable tr:nth-of-type("+x+")").addClass("odd");
									$("#sortable tr:nth-of-type("+y+")").addClass("odd");
									$("#sortable tr:nth-of-type("+z+")").addClass("odd");

						});
				 }
			 });
});


$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },5000);
$scope.reload_dispatch = function() {
//alert("reload")
//	var getordercount = 0;
 			data_reload = Orders.query({completedFilter : "false"});
 			data_reload.$promise.then(function (data_new) {
  					angular.extend(data, data_new);
						if(data.length > data_new.length){
							//alert("use" +data.length + " : "+ data_new.length);
					  	data.splice(-1, 1);
					  }
					console.log("data to angular json::"+angular.toJson(data));
						console.log("data length::"+data.length);
  					$scope.tableParams.total(data.length);
  					$scope.tableParams.reload();
					//	getordercount++;
					//	console.log("IN LOOP  "+ 	getordercount );
 			});
		//	return getordercount;
		//	console.log("getcount   "+getordercount);
		$scope.clicktomoDate=0;
		$scope.clickcurDate=0;
		$scope.clickpastDate=0;
		init();
 };

 $scope.countdata = [];
 $scope.clickCountrec = 0;
 $scope.Inernalcntfn = function(resid){
	 		angular.forEach(data, function(value, key){
						if(value.PARENT_ORDER == resid) {
				 					$scope.countdata.push(value);
				  				$scope.clickCountrec++;
									console.log("IN LOOP  "+ 	$scope.clickCountrec );
						}
	 });
 }
 getCustomerById = function(obj, id) {
 		var found = null;
 		angular.forEach(obj, function(item) {
 			if (item.id == id) found = item;
 		});
 		return found;
 }

$scope.getNotes = function(res){
			$scope.notes = res;
			ngDialog.openConfirm({
			template: 'shownotes',
			className: 'ngdialog-theme-default',
			preCloseCallback: 'preCloseCallbackOnScope',
			scope: $scope
	}).then(function (value) {		});
}

$scope.NotMenuOptions = [
		['Cancel', function ($itemScope) {
		 //	if($itemScope.user.INTERNAL_ORDERID == null || $itemScope.user.INTERNAL_ORDERID =='NaN' ){
						$interval.cancel($scope.Timer);
						console.log("ORDERS CANCEL");
						console.log("context");
						console.log($itemScope);

						var rowid = $itemScope.user.ID;
						var dvrId = $itemScope.user.DRIVER_ID;
						var order = new Orders;
						//order.id = user.orderinfo.ID;
						order.customerId =$itemScope.user.CUSTOMER_ID;
						//alert("cust "+user.orderinfo.CUSTOMER_ID)
						//order.containerId = $itemScope.user.CONTAINER_ID; //1;
						order.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID; //1;
						order.instruction = $itemScope.user.INSTRUCTION;
						order.serviceType = "Cancel";

						order.internalOrderid = "NaN";
						console.log("check data serive:  " + $itemScope.user.SERVICE_TYPE);
						order.siteId = $itemScope.user.SITE_ID;
						//alert(user.orderinfo.SITE_ID)
						//order.driverId = user.orderinfo.DRIVER_ID ;
						console.log("Edit:" + angular.toJson(order));
						//order.$update(index);
						angular.extend(order, $itemScope.user);
						$scope.tableParams.reload();
						order.$update({
							id: $itemScope.user.ID
						}).then(function(response) {
							console.log("Responseeee:" + angular.toJson(response));

							angular.extend($itemScope.user, response);
							$scope.tableParams.reload();
							$scope.reload_dispatch();
							if($itemScope.user.DRIVER_ID != null){
							console.log("if");
							$timeout(function() {	$scope.releaseDispatch($itemScope.user);}, 2000);

						}
							$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
						},function(error){
							$scope.failShowGet = true;
							$timeout(function() {$scope.failShowGet = false;}, 5000);
						});
				//	}

				/*	else
						{
							$scope.cancelnotallow = true;
							$timeout(function () {
							$scope.cancelnotallow = false;
							}, 5000);
						}*/
		}],null,
		['Cancel-TripCharge', function ($itemScope) {
			//	if($itemScope.user.INTERNAL_ORDERID == null || $itemScope.user.INTERNAL_ORDERID =='NaN' ){
						$interval.cancel($scope.Timer);
						console.log("ORDERS CANCEL");
						console.log("context");
						console.log($itemScope);

						var rowid = $itemScope.user.ID;
						var dvrId = $itemScope.user.DRIVER_ID;
						var order = new Orders;
						//order.id = user.orderinfo.ID;
						order.customerId =$itemScope.user.CUSTOMER_ID;
						//alert("cust "+user.orderinfo.CUSTOMER_ID)
						order.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID; //1;
						order.instruction = $itemScope.user.INSTRUCTION;
						order.serviceType = "Cancel-TripCharge";
						order.internalOrderid = "NaN";
						console.log("check data serive:  " + $itemScope.user.SERVICE_TYPE);
						order.siteId = $itemScope.user.SITE_ID;
						//alert(user.orderinfo.SITE_ID)
						//order.driverId = user.orderinfo.DRIVER_ID ;
						console.log("Edit:" + angular.toJson(order));
						//order.$update(index);
						angular.extend(order, $itemScope.user);
						$scope.tableParams.reload();
						order.$update({
							id: $itemScope.user.ID
						}).then(function(response) {
							console.log("Responseeee:" + angular.toJson(response));

							angular.extend($itemScope.user, response);
							$scope.tableParams.reload();
							$scope.reload_dispatch();
							if($itemScope.user.DRIVER_ID != null){
							console.log("if");
							$timeout(function() {	$scope.releaseDispatch($itemScope.user);}, 2000);

						}
							$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);

						},function(error){
							$scope.failShowGet = true;
							$timeout(function() {$scope.failShowGet = false;}, 5000);
						});
				//	}

				/*	else
						{
							$scope.cancelnotallow = true;
							$timeout(function () {
							$scope.cancelnotallow = false;
							}, 5000);
						}*/
		}]
	];
$scope.MenuOptions = [
            ['RTY', function ($itemScope) {
							 $interval.cancel($scope.Timer);
							 //console.log($itemScope);
							//alert($itemScope.user.driverid);
							$scope.Inernalcntfn($itemScope.user.ID);

	             		$scope.orders = Orders.query();
              		var OrderRTY = new Orders();

             			OrderRTY.customerId = $itemScope.user.CUSTOMER_ID;
             			OrderRTY.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID;
             			OrderRTY.instruction = $itemScope.user.INSTRUCTION;
             			//OrderRTY.driverId = $itemScope.user.DRIVER_ID
             			OrderRTY.orderDate = ($filter('date')(new Date($itemScope.user.ORDER_DATE),'yyyy-MM-ddTHH:mm:ss')) + "Z";
									$scope.scheduleDate = new Date(now.getFullYear(), now.getMonth(),now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
             			OrderRTY.scheduleDate = ($filter('date')(new Date($scope.scheduleDate),'yyyy-MM-ddTHH:mm:ss')) + "Z";
             			OrderRTY.serviceType = 'iRTY';
								  OrderRTY.companyId =	$scope.company_id;
             			OrderRTY.siteId = $itemScope.user.SITE_ID;
             			OrderRTY.parentOrder = $itemScope.user.ID;
									$scope.clickCountrec++;
									OrderRTY.internalOrderid = $itemScope.user.ID +"."+	$scope.clickCountrec;
									console.log("Infunction  "+$scope.clickCountrec);
             			//console.log("Complete drag AutoDrag Release:"+angular.toJson(OrderRTY));
             			OrderRTY.$save().then(function(response){

  									$scope.clickCountrec = 0;
										$scope.reload_dispatch();
										 $scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
    		    			}, function(reason) {
              				$scope.failShowGet = true;
              				$timeout(function() {  $scope.failShowGet = false;  }, 5000);
    		    			});

            }], null,
            ['Landfills', function ($itemScope) {
								 $interval.cancel($scope.Timer);
									ngDialog.openConfirm({
		 									template: 'addDialogId',
		 									className: 'ngdialog-theme-default',
		 									preCloseCallback: 'preCloseCallbackOnScope',
		 									scope: $scope
	 								}).then(function (value) {
		 									//alert("model" +$itemScope.user.ID);
											//$scope.landsInernalcntfn($itemScope.user.ID);

											$scope.Inernalcntfn($itemScope.user.ID);
												console.log("VALUE");
		 									console.log(angular.toJson(value));
		 									console.log(value.name+' , '+value.city);
		 									$scope.landfillval = value.name+' , '+value.city;

												$scope.orders = Orders.query();
												var OrderLND = new Orders();
												OrderLND.customerId = $itemScope.user.CUSTOMER_ID;
												OrderLND.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID;
												OrderLND.instruction = $itemScope.user.INSTRUCTION;
												//OrderLND.driverId = $itemScope.user.DRIVER_ID
												OrderLND.orderDate = ($filter('date')(new Date($itemScope.user.ORDER_DATE),'yyyy-MM-ddTHH:mm:ss')) + "Z";
												$scope.scheduleDate = new Date(now.getFullYear(), now.getMonth(),now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
												OrderLND.scheduleDate = ($filter('date')(new Date($scope.scheduleDate),'yyyy-MM-ddTHH:mm:ss')) + "Z";
												OrderLND.serviceType = 'iRTY';
												OrderLND.companyId =	$scope.company_id;
												OrderLND.siteId = $itemScope.user.SITE_ID;
												OrderLND.parentOrder = $itemScope.user.ID;
												OrderLND.landfillCname = 	$scope.landfillval;
												OrderLND.landfillLatitude = value.latitude;
												OrderLND.landfillLongitude =  value.longitude;
												OrderLND.landfillMarker =  value.landfillmarker;

											  $scope.clickCountrec++;
											  //OrderLND.internalLandfillid = $itemScope.user.ID +"."+	$scope.clickCountrec;
												OrderLND.internalOrderid = $itemScope.user.ID +"."+	$scope.clickCountrec;

												console.log("Infunction LNDS  "+$scope.clickCountrec);
												console.log(angular.toJson(OrderLND));
												OrderLND.$save().then(function(response){
													//$scope.landsclickCountrec = 0;
													$scope.clickCountrec = 0;
													$scope.reload_dispatch();
													$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
												}, function(reason) {
														$scope.failShowGet = true;
														$timeout(function() {  $scope.failShowGet = false;  }, 5000);
												});






	 									}, function (reason) {
		 								console.log('Modal promise rejected. Reason: ', reason);
	 								});

            }], null,
					/*	['LLO', function ($itemScope) {
							 $interval.cancel($scope.Timer);
							console.log($itemScope);
							//alert($itemScope.user.driverid);
							$scope.Inernalcntfn($itemScope.user.ID);

	             		$scope.orders = Orders.query();
              		var OrderRTY = new Orders();

             			OrderRTY.customerId = $itemScope.user.CUSTOMER_ID;
             			OrderRTY.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID;
             			OrderRTY.instruction = $itemScope.user.INSTRUCTION;
             			//OrderRTY.driverId = $itemScope.user.DRIVER_ID
             			OrderRTY.orderDate = ($filter('date')(new Date($itemScope.user.ORDER_DATE),'yyyy-MM-ddTHH:mm:ss')) + "Z";
									$scope.scheduleDate = new Date(now.getFullYear(), now.getMonth(),now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
             			OrderRTY.scheduleDate = ($filter('date')(new Date($scope.scheduleDate),'yyyy-MM-ddTHH:mm:ss')) + "Z";
             			OrderRTY.serviceType = 'iLLO';
             			OrderRTY.siteId = $itemScope.user.SITE_ID;
									OrderRTY.internalOrderid = "NaN";

									console.log("Infunction  "+$scope.clickCountrec);
             			//console.log("Complete drag AutoDrag Release:"+angular.toJson(OrderRTY));
             			OrderRTY.$save().then(function(response){

  									//$scope.clickCountrec = 0;
										$scope.reload_dispatch();
										$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
    		    			}, function(reason) {
              				$scope.failShowGet = true;
              				$timeout(function() {  $scope.failShowGet = false;  }, 5000);
    		    			});


            }], null,*/
						['RTR', function ($itemScope) {
							 $interval.cancel($scope.Timer);
							console.log($itemScope);
							//alert($itemScope.user.driverid);
						//	$scope.Inernalcntfn($itemScope.user.ID);

	             		$scope.orders = Orders.query();
              		var OrderRTY = new Orders();

									OrderRTY.customerId =$itemScope.user.CUSTOMER_ID;
									//alert("cust "+user.orderinfo.CUSTOMER_ID)
									OrderRTY.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID; //1;
									OrderRTY.instruction = $itemScope.user.INSTRUCTION;
									OrderRTY.siteId = $itemScope.user.SITE_ID;
										OrderRTY.serviceType = 'iRTR';
									console.log("Edit:" + angular.toJson(OrderRTY));

								//	OrderRTY.internalOrderid = "NaN";
								angular.extend(OrderRTY, $itemScope.user);
								$scope.tableParams.reload();
								OrderRTY.$update({id:$itemScope.user.ID}).then(function(response){
 									console.log("ResponsedragAutoDispatch:"+angular.toJson(response));

									angular.extend($itemScope.user, response);
									$scope.tableParams.reload();
									$scope.reload_dispatch();
 									}, function(reason) {
              				$scope.failShowGet = true;
              				$timeout(function() {  $scope.failShowGet = false;  }, 5000);
    		    			});


            }], null,
						['Cancel', function ($itemScope) {


										$interval.cancel($scope.Timer);
			  						console.log("ORDERS CANCEL");
											console.log("context");
			  						console.log($itemScope);

										var rowid = $itemScope.user.ID;
										var dvrId = $itemScope.user.DRIVER_ID;
										var order = new Orders;
										//order.id = user.orderinfo.ID;
										order.customerId =$itemScope.user.CUSTOMER_ID;
										//alert("cust "+user.orderinfo.CUSTOMER_ID)
										order.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID; //1;
										order.instruction = $itemScope.user.INSTRUCTION;

										order.serviceType = "Cancel";
										order.internalOrderid = "NaN";
										console.log("check data serive:  " + $itemScope.user.SERVICE_TYPE);
										order.siteId = $itemScope.user.SITE_ID;
										//alert(user.orderinfo.SITE_ID)
										//order.driverId = user.orderinfo.DRIVER_ID ;
										console.log("Edit:" + angular.toJson(order));



										//order.$update(index);
										angular.extend(order, $itemScope.user);
										$scope.tableParams.reload();

										order.$update({
											id: $itemScope.user.ID
										}).then(function(response) {
											console.log("Responseeee:" + angular.toJson(response));
											if($itemScope.user.DRIVER_ID != null){
											console.log("if");
											$timeout(function() {	$scope.releaseDispatch($itemScope.user);}, 2000);

										}
											//response.CUSTOMER_ID = response.customer.id;
											response.CUSTOMER_ID = response.customerId;
											response.ID = response.id;
											response.INSTRUCTION = response.instruction;
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
												response.SIZE = cont.size;
											}
										//	response.COMPLETE_DATE =  response.completeDate;

											console.log("response.COMPLETE_DATE  :" +response.COMPLETE_DATE);
											response.INTERNAL_ORDERID = response.internalOrderid;
											//if(driver){response.DRIVER_NAME = driver.name;}
											angular.extend($itemScope.user, response);
											$scope.tableParams.reload();
											$scope.reload_dispatch();
										//	$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
										},function(error){
											$scope.failShowGet = true;
											$timeout(function() {$scope.failShowGet = false;}, 5000);
										});




			  		}], null,
						['Cancel-TripCharge', function ($itemScope) {


										$interval.cancel($scope.Timer);
			  						console.log("ORDERS CANCEL");
											console.log("context");
			  						console.log($itemScope);

										var rowid = $itemScope.user.ID;
										var dvrId = $itemScope.user.DRIVER_ID;
										var order = new Orders;
										//order.id = user.orderinfo.ID;
										order.customerId =$itemScope.user.CUSTOMER_ID;
										//alert("cust "+user.orderinfo.CUSTOMER_ID)
										order.containerSizeId = $itemScope.user.CONTAINER_SIZE_ID; //1;
										order.instruction = $itemScope.user.INSTRUCTION;

										order.serviceType = "Cancel-TripCharge";
										order.internalOrderid = "NaN";
										console.log("check data serive:  " + $itemScope.user.SERVICE_TYPE);
										order.siteId = $itemScope.user.SITE_ID;
										//alert(user.orderinfo.SITE_ID)
										//order.driverId = user.orderinfo.DRIVER_ID ;
										console.log("Edit:" + angular.toJson(order));



										//order.$update(index);
										angular.extend(order, $itemScope.user);
										$scope.tableParams.reload();

										order.$update({
											id: $itemScope.user.ID
										}).then(function(response) {
											console.log("Responseeee:" + angular.toJson(response));
											if($itemScope.user.DRIVER_ID != null){
											console.log("if");
											$timeout(function() {	$scope.releaseDispatch($itemScope.user);}, 2000);

										}
											//response.CUSTOMER_ID = response.customer.id;
											response.CUSTOMER_ID = response.customerId;
											response.ID = response.id;
											response.INSTRUCTION = response.instruction;
											//response.ORDER_DATE=response.orderDate;
											response.SCHEDULE_DATE = response.scheduleDate;
											response.SERVICE_TYPE = response.serviceType;
											response.SITE_ID = response.siteId;
											//response.DRIVER_ID =response.driverId;
											var cust = getCustomerById($scope.customers, response.customer.id);
											var site = getCustomerById($scope.sites, response.site.id);
											var cont = getCustomerById($scope.containers, response.containerSize.id);
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
												response.SIZE = cont.size;
											}
										//	response.COMPLETE_DATE =  response.completeDate;

											console.log("response.COMPLETE_DATE  :" +response.COMPLETE_DATE);
											response.INTERNAL_ORDERID = response.internalOrderid;
											//if(driver){response.DRIVER_NAME = driver.name;}
											angular.extend($itemScope.user, response);
											$scope.tableParams.reload();
											$scope.reload_dispatch();
										//	$scope.Timer =   $interval( function(){   $scope.reload_dispatch(); },300000);
										},function(error){
											$scope.failShowGet = true;
											$timeout(function() {$scope.failShowGet = false;}, 5000);
										});




			  		}]
        ];
$scope.lands = {namecity:""}
$scope.customers = Customers.query();
$scope.drivers = Drivers.query();
$scope.vehicles = Vehicles.query();
$scope.orders = Orders.query();
$scope.sites = Sites.query();
$scope.containersize = ContainerSize.query();
$scope.landfills = Landfills.query();
// page reload function starts
var driver_info  = $scope.drivers;
var order_info   = $scope.orders;
var finalObj = driver_info.concat(order_info);
driver_info.$promise.then(function (driver_info) {
		var i, first = [],second, third;
		var many = 1;
    $scope.displayMode = "desktop";
    if ($scope.displayMode == "mobile") {many = 1;}
    else if ($scope.displayMode == "tablet") {many = 3;}
    else {many = 10;}
    for (i = 0; i < $scope.drivers.length; i += many) {
      second = {  driver1: $scope.drivers[i]};
   		second.driver2 = $scope.drivers[i + 1];
   		second.driver3 = $scope.drivers[i + 2];
   		second.driver4 = $scope.drivers[i + 3];
   		second.driver5 = $scope.drivers[i + 4];
   		second.driver6 = $scope.drivers[i + 5];
   		second.driver7 = $scope.drivers[i + 6];
   		second.driver8 = $scope.drivers[i + 7];
   		second.driver9 = $scope.drivers[i + 8];
   		second.driver10 = $scope.drivers[i +9];
      first.push(second);
    }
    $scope.groupedSlides = first;
	//alert('driver list:'+angular.toJson($scope.groupedSlides));
});

$scope.orderTimer =   $interval( function(){   $scope.getcount(); },2000);
// page reload function ends
$scope.getcount = function(param) {
	$scope.countord = 0;
	//angular.forEach($scope.orders, function(value, key){
	angular.forEach(data, function(value, key){
			//console.log("COUNT ORDERS");
			//	var sch_date   = new Date(value.SCHEDULE_DATE);
			//	var todayDate = new Date(); //Today Date
			//if(value.SERVICE_TYPE == param && sch_date <= todayDate)
			if(value.SERVICE_TYPE != 'Cancel' && value.SERVICE_TYPE != 'Cancel-TripCharge'){
			//	if(value.SERVICE_TYPE != 'Cancel-TripCharge' ){

				$scope.countord++;
	 	//	}

		}

		//	console.log($scope.countord);
  });
	return $scope.countord;
};

$scope.formatName = function(name){
    var matches = name.match(/\b(\w)/g);              // ['J','S','O','N']
		var acronym = matches.join('');
    return acronym;
};

$scope.disable_release = function(res){
		$('#releasebtn'+res.ID).addClass('disabled');
		$('#completebtn'+res.ID).addClass('disabled');
};

$scope.releaseDispatch = function(res){
		var onloadDriverid = res.driverid;
		if(onloadDriverid == null){
			onloadDriverid = res.DRIVER_ID;
		}
		if($('#getRow'+res.ID).hasClass("sky_blue_bk")){
			//alert(res.ID+" - "+onloadDriverid)
			$('.drv_cir'+onloadDriverid).removeClass("sky_blue_bk").addClass("grey");
			$('.drv_cir'+onloadDriverid).removeClass("sky_blue_border").addClass("grey");
			$('#getRow'+res.ID).removeClass("sky_blue_bk").addClass("grey");
			$("#tr"+res.ID).droppable();
			$("#tr"+res.ID).droppable("enable");
			$('#getRow'+res.ID).droppable();
			$('#getRow'+res.ID).droppable("enable");
			var autoDispatch = new Orders;
			autoDispatch.orderStatus = 'NaN';
			autoDispatch.driverId = 0;
			autoDispatch.dispatchDate ="";
			console.log("Complete drag AutoDrag Release:"+angular.toJson(autoDispatch));
      autoDispatch.$update({id:res.ID}).then(function(response){
									console.log("ResponsedragAutoDispatch:"+angular.toJson(response));
                  response.DISPATCH_DATE = "";
									//response.ORDER_STATUS = "";
			});

			var order_info   = Orders.query();
			order_info.$promise.then(function (order_info) {
						angular.forEach(order_info, function(ord_value,ord_index) {
								var driver_id   = order_info[ord_index]['DRIVER_ID'];
								var ord_status   = order_info[ord_index]['ORDER_STATUS'];
								if(driver_id==onloadDriverid && ord_status=='deck'){
									console.log('onloadDriverid::'+onloadDriverid+':driver_id:'+driver_id);
									var order_id_to_update = order_info[ord_index]['ID'];
									console.log('order_id_to_update: '+order_id_to_update);
									var migrateDispatch = new Orders;
									migrateDispatch.orderStatus = 'progress';
									//migrateDispatch.driverId = onloadDriverid;
									var nowdate = new Date();
									migrateDispatch.setdispatchDate = new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate(), nowdate.getHours(), nowdate.getMinutes(), nowdate.getSeconds());
									migrateDispatch.dispatchDate =($filter('date')(new Date(migrateDispatch.setdispatchDate),'yyyy-MM-ddTHH:mm:ss'));
									console.log("Migration Request"+angular.toJson(migrateDispatch));
									migrateDispatch.$update({id:order_id_to_update}).then(function(response){
									console.log("Migration Orders"+angular.toJson(response));
									//response.//DISPATCH_DATE = "";
									//response.ORDER_STATUS = "";
									});
									if($('#releasebtn'+order_id_to_update).hasClass('disabled')){
										$('#releasebtn'+order_id_to_update).removeClass('disabled');
									}
									if($('#completebtn'+order_id_to_update).hasClass('disabled')){
										$('#completebtn'+order_id_to_update).removeClass('disabled');
									}
									if($(".ord"+order_id_to_update).hasClass("sky_blue_border")){
										//alert("auto migrate "+onloadDriverid+res.ID + res.DISPATCH_DATE);
										$('#getRow'+res.ID).removeClass("grey").addClass("sky_blue_bk");
										$('#getRow'+res.ID).removeClass("sky_blue_bk").addClass("grey");
										$('.drv_cir'+onloadDriverid).removeClass("grey").addClass("sky_blue_bk");
										$(".ord"+order_id_to_update).removeClass("sky_blue_border").addClass("sky_blue_bk");
										$('.drv_cir'+onloadDriverid).draggable();
										$('.drv_cir'+onloadDriverid).draggable("enable");
										var progDrivers = new Drivers;
										progDrivers.id = onloadDriverid;
										progDrivers.driverStatus = "progress";
										console.log(angular.toJson(progDrivers));
										progDrivers.$update({id:onloadDriverid}).then(function(response){
												console.log(angular.toJson(response));
												response.driverStatus = response.driverStatus;
												console.log('Driver updated successfully progress status '+response.dispatchDate);
										});
										//alert("auto "+res.orderSts +order_id_to_update);
										//res.orderSts = "prog";
										var dropData= {};
										dropData.orderSts = 'prog';
										dropData.orderDeck = '';
										dropData.auto_sts = 'onprog';
										//$(".ord"+order_id_to_update).add("dropdata");
										$("#tr"+order_id_to_update).data("datavalue", dropData );
										var val =  $("#tr"+order_id_to_update).data("datavalue");
										order_info[ord_index]['orderDeck'] = '';
										order_info[ord_index]['orderSts'] = 'prog';
										order_info[ord_index]['auto_sts'] = 'onprog';
										angular.extend($("#tr"+order_id_to_update).data("scope").user,dropData);
										//alert(ord_index);
									}
							else{
										var progRelease = new Drivers;
										progRelease.id = onloadDriverid;
										progRelease.driverStatus = "NaN";
										console.log(angular.toJson(progRelease));
										progRelease.$update({id:onloadDriverid}).then(function(response){
												console.log(angular.toJson(response));
												response.driverStatus = response.driverStatus;
												console.log('Driver update in Release '+response.driverStatus);
										});
							}
							res.driverid = "";
							res.DRIVER_ID = "";
							//$(".ord"+res.ID).text('');
							}
						});
					});
							var progRelease = new Drivers;
							progRelease.id = onloadDriverid;
							progRelease.driverStatus = "NaN";
							console.log(angular.toJson(progRelease));
							progRelease.$update({id:onloadDriverid}).then(function(response){
							console.log(angular.toJson(response));
							response.driverStatus = response.driverStatus;
							console.log('Driver update in Release '+response.driverStatus);
							});
							//res.driverid = "";
							if(res.driverid == undefined){  res.DRIVER_ID = ""; res.DISPATCH_DATE = null;res.DRIVER_NAME = null;}
							else{res.driverid = "";}
							$timeout(function(){
									$scope.disable_release(res); },1000);
									res.ORDER_STATUS= 'NaN';
									res.orderSts='PNaN';
							}

if(($('#getRow'+res.ID).hasClass("sky_blue_border")) && ($('.drv_cir'+onloadDriverid).hasClass("sky_blue_border"))) {

			$('.drv_cir'+onloadDriverid).removeClass("sky_blue_border").addClass("sky_blue_bk");
			$('#getRow'+res.ID).removeClass("sky_blue_border").addClass("grey");
			$('.drv_cir'+res.ID).draggable();
			$('.drv_cir'+onloadDriverid).draggable("enable");
			$("#tr"+res.ID).droppable();
			$("#tr"+res.ID).droppable("enable");
			$('#getRow'+res.ID).droppable();
			$('#getRow'+res.ID).droppable("enable");
									var deckDispatch = new Orders;
									deckDispatch.orderStatus = 'NaN';
									deckDispatch.driverId = 0;
									deckDispatch.dispatchDate = "";
									console.log("Complete drag AutoDrag Release:"+angular.toJson(deckDispatch));			deckDispatch.$update({id:res.ID}).then(function(response){
									console.log("ResponsedragAutoDispatch:"+angular.toJson(response));						response.DISPATCH_DATE = "";
									});

									var deckRelease = new Drivers;
							//deckRelease.id = onloadDriverid;
							deckRelease.driverStatus = "progress";
							console.log(angular.toJson(deckRelease));
							deckRelease.$update({id:onloadDriverid}).then(function(response){
							console.log(angular.toJson(response));
							response.driverStatus = response.driverStatus;
							console.log('Driver deck in Release '+response.driverStatus);
							});
							if(!$('#releasebtn'+res.ID).hasClass('disabled')){
									$('#releasebtn'+res.ID).addClass('disabled');
									}
									if(!$('#completebtn'+res.ID).hasClass('disabled')){
									$('#completebtn'+res.ID).addClass('disabled');
									}
				//res.driverid = null;
				if(res.driverid == undefined){  res.DRIVER_ID = ""; res.DISPATCH_DATE = null;res.DRIVER_NAME = null;}
			    else{res.driverid = "";}
				//alert(res.orderSts);
							res.ORDER_STATUS= 'NaN';
							res.orderDeck = 'DNaN';
						$timeout(function(){
			$scope.disable_release(res); },1000);
						}
						$('#releasebtn'+res.ID).addClass('disabled');
						$('#completebtn'+res.ID).addClass('disabled');
	}

	$scope.chkExtCpt = function(res){
		 console.log("FUNCTION LOAD" );
		 //console.log(value.parentOrder == resid || value.PARENT_ORDER == resid)
   //var orderdata   = Orders.query();
		angular.forEach(data, function(value, key){
			//console.log("FOREXACH");
			 //console.log(value.ID);
			 if(value.ID == res) {
				 if(value.COMPLETE_DATE == null){
						if(value.SERVICE_TYPE == 'Cancel' || value.SERVICE_TYPE == 'Cancel-TripCharge')
						{
						$scope.chkintlsts ="allow";
					}
					else {
							$scope.chkintlsts ="NOTallow";
					}
				 }

			 }
		});
		//console.log( $scope.countdata );
	 //	console.log("Outfunction  "+$scope.clickCountrec);
	}

					$scope.completeDispatch = function(res)
					{
							$scope.chkintlsts ="allow";
					  	$scope.prntId = res.PARENT_ORDER;
						  $scope.chkExtCpt($scope.prntId);
						console.log("AFTER FUCTEWTW!!!!!!!!!!!!!!!!             "+	$scope.chkintlsts);
					//	console.log(res.PARENT_ORDER);
					if($scope.chkintlsts == "allow" ){
					var user = this.user;
					var index = data.indexOf(user);
						 onloadDriverid = res.driverid;
						if(onloadDriverid == null){
									onloadDriverid = res.DRIVER_ID; //alert("releaseif  "+ onloadDriverid)
						}
						if($('.ord'+res.ID).hasClass("sky_blue_bk"))
						{
							//alert("cmp"+res.ID);
						var now = new Date();
						res.completeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
						var complete = new Orders;
						complete.driverId = onloadDriverid;
						console.log(complete.driverId);
						complete.completeDate =($filter('date')(new Date(res.completeDate),'yyyy-MM-ddTHH:mm:ss'));
						console.log("Complete btn Click:"+angular.toJson(complete));
						complete.orderStatus = 'Complete';
						angular.extend(res);
						complete.$update({id:res.ID}).then(function(response){
						console.log("Response click:  "+angular.toJson(response));
						response.DRIVER_ID =response.driver.id;
						console.log("TEST:"+response.driver.id);
						response.COMPLETE_DATE =($filter('date')(new Date(response.completeDate),'yyyy-MM-ddTHH:mm:ss'));
						    $("#tr"+res.ID).hide();
								$scope.chkStatus = "";
								var order_info   = Orders.query();
								order_info.$promise.then(function (order_info) {
								angular.forEach(order_info, function(ord_value,ord_index) {
								var driver_id   = order_info[ord_index]['DRIVER_ID'];
								var ord_id   = order_info[ord_index]['ID'];
								var ord_status   = order_info[ord_index]['ORDER_STATUS'];
								var completed_date   = order_info[ord_index]['COMPLETE_DATE'];
								//alert(ord_status)
								//console.log("NEW ::  "+ord_id+" :: "+ord_status);
								//alert(driver_id+"=="+onloadDriverid +"&&"+ ord_status+" == progress");
								if(driver_id==onloadDriverid)
								{
									if(completed_date==null && ord_status=='deck'  ){
										//alert("if");
										order_id_to_update = order_info[ord_index]['ID'];
										$scope.drivercount = 2;
										// automigrate for pagination
										var dropData= {};
										dropData.orderSts = 'prog';
										dropData.orderDeck = '';
										$("#tr"+order_id_to_update).data("datavalue", dropData );
										var val =  $("#tr"+order_id_to_update).data("datavalue");
										order_info[ord_index]['orderDeck'] = '';
										order_info[ord_index]['orderSts'] = 'prog';
										angular.extend($("#tr"+order_id_to_update).data("scope").user,dropData);
										// automigrate for pagination ends
										//sleep(250000);
									}
									else{
										if($scope.drivercount == 0 && $scope.drivercount != 2){
											//alert("ifTESt "+ord_status + $scope.drivercount)
											$scope.drivercount = 1;
										}
										else{
										 //alert("do nothing");
										}
										//$scope.drivercount = 1;
									}
									console.log("COUNT  "+$scope.drivercount);
								}
								});
								console.log("AfterIF COUNT  "+$scope.drivercount);
								if($scope.drivercount == 2 ){
									//alert(" first "+order_id_to_update);
									$scope.chkStatus = "automgt";
									var migrateDispatch = new Orders;
									migrateDispatch.orderStatus = 'progress';
									//migrateDispatch.driverId = onloadDriverid;
									//console.log(migrateDispatch.orderStatus);
									console.log("Migration Request"+angular.toJson(migrateDispatch));
									migrateDispatch.$update({id:order_id_to_update}).then(function(response){
									//alert("mgt prog")
									console.log("Migration Orders"+angular.toJson(response));
									//response.//DISPATCH_DATE = "";
									//response.ORDER_STATUS = "";
									});
									var autodeckcomplete = new Drivers;
							//deckRelease.id = onloadDriverid;
							autodeckcomplete.driverStatus = "progress";
							console.log(angular.toJson(autodeckcomplete));
							autodeckcomplete.$update({id:onloadDriverid}).then(function(response){
							console.log(angular.toJson(response));
							//alert("auto prog")
							response.driverStatus = response.driverStatus;
							console.log('Driver deck in Release '+response.driverStatus);
							});

							if($('#releasebtn'+order_id_to_update).hasClass('disabled')){
								$('#releasebtn'+order_id_to_update).removeClass('disabled');
							}
							if($('#completebtn'+order_id_to_update).hasClass('disabled')){
								$('#completebtn'+order_id_to_update).removeClass('disabled');
							}
						if($(".ord"+order_id_to_update).hasClass("sky_blue_border")){
							//alert("automgrt" +order_id_to_update);
							$(".ord"+order_id_to_update).removeClass("sky_blue_border").addClass("sky_blue_bk");
							$('.drv_cir'+onloadDriverid).removeClass("sky_blue_border").addClass("sky_blue_bk");
							$('.drv_cir'+onloadDriverid).draggable();
							$('.drv_cir'+onloadDriverid).draggable("enable");
						}
						else
						{
							//alert("else");
							$('.drv_cir'+onloadDriverid).removeClass("sky_blue_bk").addClass("grey");
							$('.drv_cir'+onloadDriverid).draggable();
							$('.drv_cir'+onloadDriverid).draggable("enable");

							var deckcomplete = new Drivers;
							//deckRelease.id = onloadDriverid;
							deckcomplete.driverStatus = "NaN";
							console.log(angular.toJson(deckcomplete));
							deckcomplete.$update({id:onloadDriverid}).then(function(response){
							console.log(angular.toJson(response));
							//alert(" else nan ")
							response.driverStatus = response.driverStatus;
							console.log('Driver deck in Release '+response.driverStatus);
							});
						}
							$scope.drivercount = 0;
								}

						else if($scope.drivercount == 1 ){
									$scope.chkStatus = "onlyProgress";
									//alert("Final onlyProgress  ");
							$('.drv_cir'+onloadDriverid).removeClass("sky_blue_bk").addClass("grey");
							$('.drv_cir'+onloadDriverid).draggable();
							$('.drv_cir'+onloadDriverid).draggable("enable");

							var deckcomplete = new Drivers;
							//deckRelease.id = onloadDriverid;
							deckcomplete.driverStatus = "NaN";
							console.log(angular.toJson(deckcomplete));
							deckcomplete.$update({id:onloadDriverid}).then(function(response){
								//alert("prog only Nan")
							console.log(angular.toJson(response));
							response.driverStatus = response.driverStatus;
							console.log('Only Progress complete: '+response.driverStatus);
							});
								}
								});
						});
						    data.splice(index,1);
							$scope.tableParams.reload();

						}
}
//if($scope.chkintlsts == "NOTallow") {
else{
	//alert("NOT to complete internal order before we complete the external");
	 $scope.shownotallow = true;
	 $timeout(function () {
	 	$scope.shownotallow = false;
	}, 5000);
}
					}
});

App.directive('makeDraggable', function() {
	return {
		// A = attribute, E = Element, C = Class and M = HTML Comment
		restrict:'C',
		//The link function is responsible for registering DOM listeners as well as updating the DOM.
		link: function(scope, element, attrs) {
			$(element).data("scope",scope);
			$(element).draggable({
				revert : "invalid",
				cursorAt: { left: 10, top : 10 },
				helper :  function(event){
					event.preventDefault();
					return("<span class='helper fa fa-file-text-o fa-2x'></span>");
				}
			});
			if($(element)[0].nodeName!="P"){
				$(element).draggable("disable");
			}
		}
	};
});

App.directive('makeDroppable', function($compile,$filter,$window,$localStorage,$sessionStorage,$cookieStore,Orders,Drivers,$timeout) {
	return {
		restrict: 'C',
		link: function(scope,element,attrs){
				$(element).data("slideCollection",scope.slideCollection);

			//This makes an element Droppable
			if(!$(element).data("scope")) $(element).data("scope",scope);
				$(element).droppable({
				//activeClass  : "make-active",
				hoverClass : "make-over",
				drop:function(event,ui) {
					$(ui.helper.clone()).animate({
						opacity: 0,
						width: "0",
						height: "0"
					});
					var trdrop =  $(".trdrop").get($(element).index());
					$(trdrop).droppable("enable");
					var driverid = $(ui.draggable).attr("data-id");
					var drivername = $(ui.draggable).attr("data-name");
					var order_id = $(element).attr("data-oid");
					// alert('order_id:'+order_id);
				if($('.ord'+order_id).hasClass("sky_blue_bk") || $('.ord'+order_id).hasClass("sky_blue_border") )
					{
						//alert("prog"+order_id)
						$('#tr'+order_id).droppable();
						$('#tr'+order_id).droppable("disable");
						$('.ord'+order_id).droppable();
						$('.ord'+order_id).droppable("disable");
						return;
					}
						  //alert('after same class check');
					var dropData={};
					var dropUser = $(this).data("user");
						if(($(ui.draggable).hasClass("circle"))&& ($(element).hasClass("trdrop"))){
						dropData.driverid 	=  driverid;
						dropData.drivername =  drivername;
						if($(ui.draggable).hasClass("sky_blue_bk")){
							//alert("deck")
						$(ui.draggable).removeClass("sky_blue_bk").addClass("sky_blue_border");
						$(element).find( "p" ).removeClass("grey").addClass("sky_blue_border");
						$(ui.draggable).draggable("disable");
						$('#releasebtn'+order_id).removeClass("disabled");
						var driverUpdatedeck = new Orders;
						driverUpdatedeck.driverId = driverid;
						driverUpdatedeck.orderStatus = "deck";
						var now = new Date();
						driverUpdatedeck.dispatchDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
						dropData.dispatchDate =($filter('date')(new Date(driverUpdatedeck.dispatchDate),'MM/dd/yyyy @ h:mma'));
						dropData.orderDeck =  'ondeck';
						dropData.auto_sts = '';
						driverUpdatedeck.dispatchDate =($filter('date')(new Date(driverUpdatedeck.dispatchDate),'yyyy-MM-ddTHH:mm:ss'));
						angular.extend($(this).data("scope").user,dropData);
						driverUpdatedeck.$update({id:order_id}).then(function(response){
						console.log('order updated successfully' + dropData.dispatchDate);
						});
							var deckDrivers = new Drivers;
							deckDrivers.id = driverid;
							deckDrivers.driverStatus = "deck";
							//dropData.orderStatus ="deck";
							//angular.extend($(this).data("scope").user,dropData);
							console.log(angular.toJson(deckDrivers));
							deckDrivers.$update({id:driverid}).then(function(response){
							console.log(angular.toJson(response));
							response.driverStatus = response.driverStatus;
							console.log('Driver updated successfully deck status '+response.driverStatus);
							});

						$(ui.draggable).removeData("dropdata");
						$(element).data("dropdata",true);
						$(element).droppable("disable");
						//$scope.Timer =   $interval( function(){  $scope.reload_dispatch();  },5000);
						$timeout(function() {
						scope.reload_dispatch();
							//$scope.errormsg = "green"
						}, 5000);
						}
						if($(ui.draggable).hasClass("grey")){
							//alert("prog"+order_id)

						$(ui.draggable).removeClass("grey").addClass("sky_blue_bk");
						$(element).find( "p" ).removeClass("grey").addClass("sky_blue_bk");
						$('#completebtn'+order_id).removeClass("disabled");
						$('#releasebtn'+order_id).removeClass("disabled");
						//console.log("prog");

						var driverUpdateOrders = new Orders;
						driverUpdateOrders.driverId = driverid;
						driverUpdateOrders.orderStatus = "progress";
						var now = new Date();
						driverUpdateOrders.dispatchDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
						dropData.dispatchDate =($filter('date')(new Date(driverUpdateOrders.dispatchDate),'MM/dd/yyyy @ h:mma'));
						dropData.orderSts = 'prog';
						driverUpdateOrders.dispatchDate =($filter('date')(new Date(driverUpdateOrders.dispatchDate),'yyyy-MM-ddTHH:mm:ss'));
						dropData.auto_sts = '';
						console.log('order updated Progress' );
						console.log(angular.toJson(driverUpdateOrders));
						angular.extend($(this).data("scope").user,dropData);
						driverUpdateOrders.$update({id:order_id}).then(function(response){
						console.log('order updated successfully' + driverUpdateOrders.dispatchDate);

						});
						//Driver STATUS update
							var progDrivers = new Drivers;
							progDrivers.id = driverid;
							progDrivers.driverStatus = "progress";
							//dropData.orderStatus ="deck";
							//angular.extend($(this).data("scope").user,dropData);
							console.log(angular.toJson(progDrivers));
							progDrivers.$update({id:driverid}).then(function(response){
							console.log(angular.toJson(response));
							response.driverStatus = response.driverStatus;
							console.log('Driver updated successfully progress status '+response.driverStatus);
							});
						$(ui.draggable).removeData("dropdata");
						$(element).data("dropdata",true);
						$(element).droppable("disable");
						//$scope.Timer =   $interval( function(){  $scope.reload_dispatch();  },5000);
						$timeout(function() {
						scope.reload_dispatch();
							//$scope.errormsg = "green"
						}, 5000);
						}
						driverid 		= '';
						drivername 		= '';
					}
					scope.$apply();
				}
			});

		}
	};
});
App.directive('contextMenu', ["$parse", "$q", "$interval", function ($parse, $q, $interval) {
    var contextMenus = [];
    var removeContextMenus = function (level) {
        while (contextMenus.length && (!level || contextMenus.length > level)) {
            contextMenus.pop().remove();
        }
        if (contextMenus.length == 0 && $currentContextMenu) {
            $currentContextMenu.remove();
        }
    };

    var $currentContextMenu = null;
    var renderContextMenu = function ($scope, event, options, model, level) {
				$interval.cancel($scope.Timer);
        if (!level) { level = 0; }
        if (!$) { var $ = angular.element; }
        $(event.currentTarget).addClass('context');
        var $contextMenu = $('<div>');
        if ($currentContextMenu) {
            $contextMenu = $currentContextMenu;
        } else {
            $currentContextMenu = $contextMenu;
        }
        $contextMenu.addClass('dropdown clearfix');
        var $ul = $('<ul>');
        $ul.addClass('dropdown-menu');
        $ul.attr({ 'role': 'menu' });
        $ul.css({
            display: 'block',
            position: 'absolute',
            left: event.pageX + 'px',
            top: event.pageY + 'px',
            "z-index": 10000
        });
        angular.forEach(options, function (item, i) {
            var $li = $('<li>');
            if (item === null) {
                $li.addClass('divider');
            } else {
                var nestedMenu = angular.isArray(item[1])
                  ? item[1] : angular.isArray(item[2])
                  ? item[2] : angular.isArray(item[3])
                  ? item[3] : null;
                var $a = $('<a>');
                $a.css("padding-right", "8px");
                $a.attr({ tabindex: '-1' });
                var text = typeof item[0] == 'string' ? item[0] : item[0].call($scope, $scope, event, model);
                $q.when(text).then(function (text) {
                    $a.text(text);
                    if (nestedMenu) {
                        $a.css("cursor", "default");
                        $a.append($('<strong style="font-family:monospace;font-weight:bold;float:right;">&gt;</strong>'));
                    }
                });
                $li.append($a);

                var enabled = angular.isFunction(item[2]) ? item[2].call($scope, $scope, event, model, text) : true;
                if (enabled) {
                    var openNestedMenu = function ($event) {
                        removeContextMenus(level + 1);
                        var ev = {
                            pageX: event.pageX + $ul[0].offsetWidth - 1,
                            pageY: $ul[0].offsetTop + $li[0].offsetTop - 3
                        };
                        renderContextMenu($scope, ev, nestedMenu, model, level + 1);
                    }
                    $li.on('click', function ($event) {
											//alert("5");
                        //$event.preventDefault();
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            } else {
                                $(event.currentTarget).removeClass('context');
                                removeContextMenus();
                                item[1].call($scope, $scope, event, model);
                            }
                        });
                    });

                    $li.on('mouseover', function ($event) {
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            }
                        });
                    });
                } else {
                    $li.on('click', function ($event) {
                        $event.preventDefault();
                    });
                    $li.addClass('disabled');
                }
            }
            $ul.append($li);
        });
        $contextMenu.append($ul);
        var height = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        $contextMenu.css({
            width: '100%',
            height: height + 'px',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999
        });
        $(document).find('body').append($contextMenu);
        $contextMenu.on("mousedown", function (e) {
				//	alert("4");
					$scope.Timer =   $interval( function(){  $scope.reload_dispatch();  },300000);
            if ($(e.target).hasClass('dropdown')) {
                $(event.currentTarget).removeClass('context');
                removeContextMenus();
            }
        }).on('contextmenu', function (event) {
            $(event.currentTarget).removeClass('context');
            event.preventDefault();
            removeContextMenus(level);
        });
        $scope.$on("$destroy", function () {
            removeContextMenus();
        });

        contextMenus.push($ul);
    };

    return function ($scope, element, attrs, $interval) {
		//	alert("1");

        element.on('contextmenu', function (event,$interval) {
					//alert("2");

					//	$interval.cancel(ss);
            event.stopPropagation();
            $scope.$apply(function () {
							//alert("3");
                event.preventDefault();
                var options = $scope.$eval(attrs.contextMenu);
                var model = $scope.$eval(attrs.model);
                if (options instanceof Array) {
                    if (options.length === 0) { return; }
                    renderContextMenu($scope, event, options, model);
                } else {
                    throw '"' + attrs.contextMenu + '" not an array';
                }
            });

        });
    };
}]);

//var directives = angular.module('directives', []);
App.directive('showonhoverparent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.show();
            });
            element.parent().bind('mouseleave', function() {
                 element.hide();
            });
       }
   };
});

/* ************************ DispatchNew Ends*********************** */
