


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




App.controller('MapCtrl', function($scope, $state, $window, $timeout,
	$filter, $interval, ngTableParams, ngDialog, Orders) {

  var data = Orders.query({completedFilter: "false"});
    data.$promise.then(function(data) {
  				$scope.tableParams = new ngTableParams({
  					page: 1, // show first page
  				  count: 10,
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
  							var orderedData = params.filter() ?
  							$filter('filter')(data, params.filter()) : data;
  							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),
  							params.page() * params.count()));
  							params.total(orderedData.length); // set total for recalc pagination
  							}
  						});
  	});


/*
var locations = [
										['Bolton Road Landfill',33.906680 , -84.582240,'http://maps.google.com/mapfiles/ms/micons/purple-dot.png'],
										['Vcwi Group Landfill',53.576865 , -2.428219,'http://maps.google.com/mapfiles/ms/micons/purple-dot.png'],
										['Hickory Ridge Landfill',35.734454  , -81.344457,'http://maps.google.com/mapfiles/ms/micons/purple-dot.png'],
										['Allstate Waste Inc',33.906680 , -84.582240,'http://maps.google.com/mapfiles/ms/micons/purple-dot.png'],
										['Pedmont Rd,Atlanta',33.829588 , -84.367820,'http://maps.google.com/mapfiles/ms/micons/red-dot.png'],
										['SNW Salvage Yard,322 Kronger Dr,Decatur',33.774828 , -84.296312,'http://maps.google.com/mapfiles/ms/micons/red-dot.png']
							];*/



var beachMarker, contentString, i, p ;
$scope.Timer =   $interval( function(){    $scope.loadScript(); },300000);
$scope.Timer =   $interval( function(){    $scope.reload_dispatch(); },10000);
	$scope.reload_dispatch = function() {
	  var data_reload = Orders.query({completedFilter: "false"});
				data_reload.$promise.then(function (data_new) {
						angular.extend(data, data_new);
						if(data.length > data_new.length){
						data.splice(-1, 1);
					}
					//	console.log("DATA  TEST                       ::"+angular.toJson(data));
					//	console.log("DATA_NEW TEST                     ::"+angular.toJson(data_new));
					  console.log("data length ::"+data.length);
					  $scope.tableParams.total(data.length);
					  $scope.tableParams.reload();
				});
	}



	$scope.initialize = function(x,y) {

				  var p1 = x;
				  var p2 = y;
				  var a = Number(p1) ;
				  var b = Number(p2);
				//	console.log(locations);
					//console.log(data);
				       $scope.mapOptions = {
				           zoom: 7,
				           center: new google.maps.LatLng(a,b)
				       };
				       $scope.map = new google.maps.Map(document.getElementById('googleMap'), $scope.mapOptions);
							 var infoWindow = new google.maps.InfoWindow();
								/*FOR ORDERS TABLE STARTS*/
								for (p = 0; p < data.length; p++) {
									//alert(data[p].SITE_LATITUDE);
									beachMarker = new google.maps.Marker({
										position: new google.maps.LatLng(data[p].SITE_LATITUDE, data[p].SITE_LONGITUDE),
										map:  $scope.map,
										icon: data[p].SITE_MARKER_URL,
										dataId: p
									});

								 beachMarker.addListener('click', function() {
									// console.log(data[this.dataId].SITE_NAME+","+data[this.dataId].SITE_STREET+","+data[this.dataId].SITE_CITY);
									var addr_marker=data[this.dataId].SITE_NAME+","+data[this.dataId].SITE_STREET+","+data[this.dataId].SITE_CITY;
								  infoWindow.setContent(addr_marker); // 3: use dataId stored in marker to fetch content from locations array
									infoWindow.open($scope.map, this);

								 });
							 }
							 /*FOR ORDERS TABLE ENDS*/

							 /*FOR  LANDFILL MAP STARTS*/
							 for (p = 0; p < data.length; p++) {
							 	//alert(data[p].LANDFILL_MARKER);
								 beachMarker = new google.maps.Marker({
									 position: new google.maps.LatLng(data[p].LANDFILL_LATITUDE, data[p].LANDFILL_LONGITUDE),
									 map:  $scope.map,
									 icon: data[p].LANDFILL_MARKER,
									 dataId: p
								 });

								beachMarker.addListener('click', function() {
								 infoWindow.setContent(data[this.dataId].LANDFILL_CNAME); // 3: use dataId stored in marker to fetch content from locations array
								 infoWindow.open($scope.map, this);
									//infowindow.open($scope.map, beachMarker);
								});
							}
							/*FOR LANDFILL MAP STARTS*/
				}
	$scope.initializeROW = function(x,y) {
					var p1 = x;
					var p2 = y;
					var a = Number(p1) ;
					var b = Number(p2);
							 $scope.mapOptions = {
									 zoom: 10,
									 center: new google.maps.LatLng(a,b)
							 };
							 $scope.map = new google.maps.Map(document.getElementById('googleMap'), $scope.mapOptions);
							 var image = 'http://maps.google.com/mapfiles/ms/micons/red-dot.png';

							 var infowindow = new google.maps.InfoWindow({
									content: contentString
								});
							//	google.maps.Map($('div[dsid="multiGoogleMap"]').get(0), myOptions);
									beachMarker = new google.maps.Marker({
									position: {lat: a, lng: b},
										map:  $scope.map,
										icon: image
									});
								 beachMarker.addListener('click', function() {
									 infowindow.open($scope.map, beachMarker);
								 });

				}

   $scope.loadScript = function() {
       var script = document.createElement('script');
       script.type = 'text/javascript';
      // script.src = 'https://maps.google.com/maps/api/js?sensor=false&callback=initialize';
			script.src = 'http://maps.google.com/maps/api/js?sensor=false';
       document.body.appendChild(script);
       setTimeout(function() {
				 for (i = 0; i < data.length; i++) {
           $scope.initialize(data[i].SITE_LATITUDE,data[i].SITE_LONGITUDE);
				 }
     }, 2000);             //SITE_LATITUDE, data[p].SITE_LONGITUDE

   }
/*Get longitude and latitude tho' location name starts*/

   function showResult(result) {
     var a, b;
       document.getElementById('latitude').value = result.geometry.location.lat();
       document.getElementById('longitude').value = result.geometry.location.lng();

        a = document.getElementById('latitude').value;
        b = document.getElementById('longitude').value;
      // alert(a);
      // alert( b);
			   setTimeout(function() {
       $scope.initializeROW(a,b);
		 }, 500);
   }
   function getLatitudeLongitude(callback, address) {
       // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
       address = address || 'Ferrol, Galicia, Spain';
       // Initialize the Geocoder
       geocoder = new google.maps.Geocoder();
       if (geocoder) {
           geocoder.geocode({
               'address': address
           }, function (results, status) {
               if (status == google.maps.GeocoderStatus.OK) {
                   callback(results[0]);
               }
           });
       }
   }
   /*Get longitude and latitude tho' location name ends*/

   /*Table row click starts*/
   $scope.go = function(ai) {
     //console.log(ai.SITE_NAME,ai.SITE_STREET,ai.SITE_CITY);
     var addr = ai.SITE_NAME+","+ai.SITE_STREET+","+ai.SITE_CITY;
     contentString = addr;
     getLatitudeLongitude(showResult, addr);

   };
   /*Table row click ends*/
   // map popup click shows  name landfill and name of site in orders  *****
});
