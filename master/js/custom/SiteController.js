// Site ********************************************************************************************************


App.factory('Sites', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "sites";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "sites";

  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      params: {},
      isArray: true,
	  headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
    },
    save: {
      method: 'POST',
      url: $rootScope.serverUrl + 'MCF_backend/sites',
      params: {},
	  headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
    },
    update: {
      method: 'PUT',
      url: $rootScope.serverUrl + 'MCF_backend/sites/:id',
      params: {
        id: '@_id'
      },
	  headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
    },
    destroy: {
      method: 'DELETE',
      url: $rootScope.serverUrl + 'MCF_backend/sites/:id',
      params: {
        id: '@_id'
      },
	  headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}
    }

  });
});


App.controller('SiteController', function($scope, $state, $window, $timeout,
    $filter, ngTableParams, ngDialog, Sites, Customers, Orders) {
    $scope.siteInfo = {
      customer: {},
      id: "",
      name: "",
      street: "",
      secondaryStreet: "",
      city: "",
      state: "",
      latitude:"",
      longitude:"",
      postalCode: "",
      phone: ""
    };

	 $scope.custname= false;
   $scope.cust = {};
   $scope.successShow = false;
   $scope.failShowGet = false;
   $scope.uptsuccessShow = false;

   var data = Sites.query(function(res){

    },function(error){
       $scope.failShowGet = true;
			 //$timeout(function() { $scope.failShowGet = false;}, 5000);
    });
    $scope.customers = Customers.query();

    function compare(a, b) {
        if (a.name < b.name)
            return -1;
        else if (a.name > b.name)
            return 1;
        else
            return 0;
    }

    $scope.customers.$promise.then(function(results) {
        $scope.customers = results;
        $scope.customers.sort(compare);
        for (var i = 0, len = $scope.customers.length; i < len; i++) {
            console.log($scope.customers[i]);
        }
   });

    $scope.findCustomer = function(customerId) {
        for (var i = 0, len = $scope.customers.length; i < len; i++) {
            if ($scope.customers[i].id == customerId) return $scope.customers[i];
        }
    };



   $scope.orders = Orders.query();
   $scope.mappedOrders = [];
   $scope.orders.$promise.then(function(results) {
      $scope.orders = results;
      $scope.orders.sort(compare);
      for (var i = 0, len = $scope.orders.length; i < len; i++) {
          //console.log($scope.orders[i].SITE_ID);
          $scope.mappedOrders.push($scope.orders[i].SITE_ID);
          //console.log("mapped"); console.log($scope.mappedOrders);
      }
   });

   $scope.findorders = function(ordersId) {
     for (var i = 0, len = $scope.orders.length; i < len; i++) {
         if ($scope.orders[i].SITE_ID == ordersId) return $scope.orders[i];
     }
   };


    $scope.editDialog = function(editable) {
      var site = this.$parent.site;
      site.isEditing = editable;
      var index = data.indexOf(site);
      site.siteInfo = {};
      site.siteInfo.selectedCustomer = $scope.customers[site.customer.id]
      if (site.customer) {
        site.siteInfo.customer = site.customer;
      }
      site.siteInfo.id = site.id;
      site.siteInfo.name = site.name;
      site.siteInfo.phone = site.phone;
      site.siteInfo.city = site.city;
      site.siteInfo.street = site.street;
      site.siteInfo.secondaryStreet = site.secondaryStreet;
      site.siteInfo.state = site.state;
      site.siteInfo.postalCode = site.postalCode;
    };

	 $scope.callCust = function(res){
		$scope.custname= false;
	 }

    $scope.saveDialog = function() {
    //  var site = this.$parent.site;
    //  if (this.$parent.site.userForm.$valid) {
        var site = this.$parent.site;
        site.isEditing = false;
        var index = data.indexOf(site);

        data[index].id = site.siteInfo.id;
        data[index].customer = site.siteInfo.selectedCustomer
        data[index].name = site.siteInfo.name;
        data[index].street = site.siteInfo.street;
        data[index].secondaryStreet = site.siteInfo.secondaryStreet;
        data[index].city = site.siteInfo.city;
        data[index].state = site.siteInfo.state;
        data[index].postalCode = site.siteInfo.postalCode;
        data[index].phone = site.siteInfo.phone;

        site.id = site.siteInfo.id;
        site.customer = site.siteInfo.selectedCustomer
        site.name = site.siteInfo.name;
        site.street = site.siteInfo.street;
        site.secondaryStreet = site.siteInfo.secondaryStreet;
        site.city = site.siteInfo.city;
        site.state = site.siteInfo.state;
        site.postalCode = site.siteInfo.postalCode;
        site.phone = site.siteInfo.phone;
          console.log("Edit:"+angular.toJson(site.siteInfo));
        //$scope.tableParams.reload();
        var siteUpdateInstance = new Sites;
        angular.extend(siteUpdateInstance,  data[index]);
      //  console.log("Edit:" + angular.toJson(siteUpdateInstance));
        siteUpdateInstance.$update({id:data[index].id}).then(function(response) {
                console.log("Response:" + angular.toJson(response));
                $scope.uptsuccessShow = true;
				        $timeout(function() {$scope.uptsuccessShow = false;}, 5000);
        },function(reason){
                $scope.failShowGet = true;
          			$timeout(function() { $scope.failShowGet = false;}, 5000);
        });
    /*  } else {
        this.$parent.site.submitted = true;
      }*/

    };


    $scope.deleteDialog = function(siteName) {
      $scope.getsiteName = siteName;
      var row = this.$parent.site;
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
        var siteDeleteInstance = new Sites;
        angular.extend(siteDeleteInstance, data[index]);
        siteDeleteInstance.$destroy({id: data[index].id}).then(function(response){
          data.splice(index, 1);
          $scope.tableParams.reload();
        },function(reason){
            $scope.failShowGet = true;
			      $timeout(function() { $scope.failShowGet = false;}, 5000);
        });

      }, function(reason) {
        console.log('Cancel');
      });
    };

    $scope.addDialog = function() {

       var addr = $scope.addsiteInfo.name+","+$scope.addsiteInfo.street+","+$scope.addsiteInfo.city;
       getLatitudeLongitude(showResult, addr);

     };
    /*Get longitude and latitude tho' location name starts*/
       function showResult(result) {
         var a, b;
           document.getElementById('latitude').value = result.geometry.location.lat();
           document.getElementById('longitude').value = result.geometry.location.lng();

            a = document.getElementById('latitude').value;
            b = document.getElementById('longitude').value;

        if ($scope.siteForm.$valid) {
            $scope.addsiteInfo.customer = $scope.cust.selected;
  		      if($scope.addsiteInfo.customer==undefined || $scope.addsiteInfo.customer==""){
  			         $scope.custname= true;
  		      }
  		      else{
  			         var newSite = new Sites();

                 newSite.name = $scope.addsiteInfo.name;
                 newSite.street = $scope.addsiteInfo.street;
                 newSite.secondaryStreet = $scope.addsiteInfo.secondaryStreet;
                 newSite.city = $scope.addsiteInfo.city;
                 newSite.state = $scope.addsiteInfo.state;
                 newSite.postalCode = $scope.addsiteInfo.postalCode;
                 newSite.phone = $scope.addsiteInfo.phone;
                 newSite.latitude =a;
                 newSite.longitude=b;
                 newSite.markerUrl ="http://maps.google.com/mapfiles/ms/micons/red-dot.png"


  			      angular.extend(newSite, $scope.addsiteInfo);
  			        console.log("add:  " + angular.toJson(newSite));
  			        newSite.$save().then(function(response) {
  				            console.log("Response:" + angular.toJson(response));
  				            data.push(response);
  				            $scope.tableParams.reload();
                      $scope.successShow = true;
                      $timeout(function() { $scope.successShow = false; }, 5000);

  			        }, function(reason) {
                    $scope.failShowGet = true;
    			          $timeout(function() { $scope.failShowGet = false;}, 5000);
  			        });
  			        $scope.addsiteInfo.id = "";
  			        $scope.addsiteInfo.name = "";
  			        $scope.addsiteInfo.phone = "";
  			        $scope.addsiteInfo.city = "";
  			        $scope.addsiteInfo.street = "";
  			        $scope.addsiteInfo.secondaryStreet = "";
  			        $scope.addsiteInfo.city = "";
  			        $scope.addsiteInfo.state = "";
  			        $scope.addsiteInfo.postalCode = "";
  			        $scope.addsiteInfo.fax = "";
  			        $scope.addsiteInfo.website = "";
  			        $scope.addsiteInfo.federalTaxId = "";
  			        $scope.addsiteInfo.notes = "";
  			        $scope.cust.selected= "";
  			        $scope.siteForm.sitename.$dirty = false;
  			        $scope.siteForm.phone.$dirty = false;
  		    }
      }
  	  else {
          $scope.siteForm.sitename.$dirty = true;
          $scope.siteForm.street.$dirty = true;
  		    $scope.siteForm.phone.$dirty = true;
  		    $scope.custname= true;
      }
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

/* google map */
    $scope.loadScript = function() {
              var script = document.createElement('script');
              script.type = 'text/javascript';
              //script.src = 'https://maps.google.com/maps/api/js?sensor=false&callback=initialize';
              script.src = 'http://maps.google.com/maps/api/js?sensor=false';
              document.body.appendChild(script);
              setTimeout(function() {
       				// for (i = 0; i < locations.length; i++) {
                //  $scope.initialize(locations[i][1],locations[i][2]);
       			//	 }
              }, 500);

    }
/* google map */

// watch for check all checkbox
function compare(a, b) {
    if (Number(a.id) > Number(b.id))
      return -1;
    else if (Number(a.id) < Number(b.id))
      return 1;
    else
      return 0;
  }

  // watch for check all checkbox
  data.$promise.then(function(data) {
    //data.sort(compare);
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
        $scope.siteData = params.filter() ? $filter('filter')(data,
          params.filter()) : data;
        $defer.resolve($scope.siteData.slice((params.page() - 1) *
          params.count(), params.page() * params.count()));
        params.total($scope.siteData.length); // set total for recalc pagination

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
              var siteDeleteInstance = new Sites;
              angular.extend(siteDeleteInstance, $scope.multiple_del[i]);
              siteDeleteInstance.$destroy({id:dataId}).then(function(response){
              //  console.log(response);
              }, function(error){
                 $scope.failShowGet = true;
                 $timeout(function() { $scope.failShowGet = false;}, 5000);
              });
               data.splice(index,1);
              $scope.tableParams.reload();
       }
       $scope.multiple_del = [];
       $scope.tableParams.reload();
       $scope.checkboxes = { 'checked': false, items: {} };
   };
  /*Selecet multiple rows one by one and delete code starts*/

  /*Selecet all rows and delete code starts*/

  $scope.checkboxes = { 'checked': false, items: {} };
   // watch for check all checkbox
  $scope.$watch('checkboxes.checked', function(value) {
       $scope.multiple_del = [];
       angular.forEach($scope.siteData, function(item) {
            var index = $scope.mappedOrders.indexOf(item.id);
            console.log(item.id+ "!="+ $scope.mappedOrders[index]);
            if(item.id != $scope.mappedOrders[index] ){
                $scope.multiple_del.push(item);
              }
              //  console.log($scope.multiple_del);
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


  })
  // End of Site ********************************************************************************************************
