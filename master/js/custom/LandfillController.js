
// Landfill ********************************************************************************************************
/*
App.factory('Landfills', function($rootScope,$resource) {
   // return $resource('http://127.0.0.1\:8080/apiMCF/landfills/:id', { id: '@_id' }, {
	   return $resource($rootScope.app.backendURL + 'landfill' ,{
update: { method: 'PUT', params: {id: '@id'}}
    });
});  */
/*
App.factory('Landfills', function($resource, $rootScope) {

  var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "landfills/:id";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

  return $resource(endpoint, { id: '@_id' }, {

        update: { method: 'PUT', params: {id: '@id'}}
    });
});
*/

App.factory('Landfills', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "landfills";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "landfills";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

  return $resource(endpoint, {}, {

		query: {method: 'GET', params: {}, isArray: true, headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}  },
        save: {method: 'POST',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/landfills', params: {}},
		update: { method: 'PUT',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/landfills/:id', params: {id: '@_id'}},
		destroy: { method: 'DELETE',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/landfills/:id', params: {id: '@_id'}}

    });
});




App.controller('LandfillController', function($scope, $state, $window,$timeout, $filter, ngTableParams, ngDialog, Landfills, Company) {

    $scope.addlandfillInfo = {
        id: "",
        name: "",
        street: "",
        secondaryStreet: "",
        city: "",
        state: "",
        postalCode: ""
    };
	  $scope.successShow = false;
	  $scope.failShowGet = false;
    $scope.uptsuccessShow = false;

   $scope.company = Company.query();
   var company_info = $scope.company;
   company_info.$promise.then(function(company_info){
     $scope.company_id =  company_info.id;
     //console.log($scope.company_id);
   });

    var data = Landfills.query(function(res){
        console.log(angular.toJson(res));
    }, function(error){
         $scope.failShowGet = true;
  			 //$timeout(function() { $scope.failShowGet = false;}, 5000);
    });

    $scope.editDialog = function (editable) {
		var landfill = this.$parent.landfill;
		landfill.isEditing = editable;
		var index = data.indexOf(landfill);

		landfill.landfillInfo = {};
		landfill.landfillInfo.id = landfill.id;
		landfill.landfillInfo.name = landfill.name;
		landfill.landfillInfo.phone = landfill.phone;
		landfill.landfillInfo.city = landfill.city;

	  };

	  $scope.saveDialog = function () {
		    if(this.$parent.landfill.userForm.$valid){
		        var landfill = this.$parent.landfill;
		        landfill.isEditing = false;
		        var index = data.indexOf(landfill);

		        landfill.id = landfill.landfillInfo.id;
		        landfill.name = landfill.landfillInfo.name;
		        landfill.phone = landfill.landfillInfo.phone;
		        landfill.city = landfill.landfillInfo.city;
            landfill.company = $scope.company_id;
		        //angular.extend(data[index],$scope.landfillInfo);
            var addr = landfill.landfillInfo.name+","+landfill.landfillInfo.city;
            getLatitudeLongitude(showResultEdit, addr);

            $timeout(function() {
                  landfill.landLatitude =   $scope.getlatt ;
                  landfill.landLongitude =   $scope.getlngg ;
                  landfill.landfillmarker = "http://maps.google.com/mapfiles/ms/micons/purple-dot.png";

		              //console.log("Edit:"+angular.toJson(landfill.landfillInfo));
		              $scope.tableParams.reload();

		              var landfillUpdateInstance = new Landfills;
		              angular.extend(landfillUpdateInstance, data[index]);
		              landfillUpdateInstance.$update({id:data[index].id}).then(function(response){
                       //console.log(response);
                       $scope.uptsuccessShow = true;
				               $timeout(function() {$scope.uptsuccessShow = false;}, 5000);
                  },function(reason){
                       $scope.failShowGet = true;
			                 $timeout(function() { $scope.failShowGet = false;}, 5000);
                  });
            }, 5000);
		    }
		  else
		  {
			   this.$parent.landfill.submitted = true;
		  }
	};

  function showResultEdit(result) {
      var a, b;
      document.getElementById('latitude').value = result.geometry.location.lat();
      document.getElementById('longitude').value = result.geometry.location.lng();
      a = document.getElementById('latitude').value;
      b = document.getElementById('longitude').value;
      $scope.getlatt = a;
      $scope.getlngg = b;
    };

$scope.deleteDialog = function (landName) {
	$scope.getlandName = landName;
	var row = this.$parent.landfill;
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
      // Landfills.delete({id: data[index].id});
	   var landfillDeleteInstance = new Landfills;
		 angular.extend(landfillDeleteInstance, data[index]);
		 landfillDeleteInstance.$destroy({id:data[index].id}).then(function(response){
       console.log(response);
          data.splice(index,1);
          $scope.tableParams.reload();
     },function(reason){
          $scope.failShowGet = true;
			    $timeout(function() { $scope.failShowGet = false;}, 5000);
    });
       // need a call to delete to the backend
    }, function (reason) {
      console.log('Cancel');
    });
};






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
            var landfillDeleteInstance = new Landfills;
            angular.extend(landfillDeleteInstance, $scope.multiple_del[i]);
            landfillDeleteInstance.$destroy({id:dataId}).then(function(response){
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
      angular.forEach($scope.landfillData, function(item) {
           //console.log("item");console.log(item);
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


$scope.addDialog = function () {
  var addr = $scope.addlandfillInfo.name+","+$scope.addlandfillInfo.street+","+$scope.addlandfillInfo.city;
  getLatitudeLongitude(showResult, addr);
};


/*Get longitude and latitude tho' location name starts*/
  function showResult(result) {
      var a, b;
      document.getElementById('latitude').value = result.geometry.location.lat();
      document.getElementById('longitude').value = result.geometry.location.lng();
      a = document.getElementById('latitude').value;
      b = document.getElementById('longitude').value;
      if($scope.landForm.$valid){
              var newLandfill = new Landfills;
              newLandfill.name = $scope.addlandfillInfo.name;
              newLandfill.street = $scope.addlandfillInfo.street;
              newLandfill.secondaryStreet = $scope.addlandfillInfo.secondaryStreet;
              newLandfill.city = $scope.addlandfillInfo.city;
              newLandfill.state = $scope.addlandfillInfo.state;
              newLandfill.postalCode = $scope.addlandfillInfo.postalCode;
              newLandfill.phone = $scope.addlandfillInfo.phone;
              newLandfill.company = $scope.company_id;
              newLandfill.landLatitude = a;
              newLandfill.landLongitude = b;
              newLandfill.landfillmarker = "http://maps.google.com/mapfiles/ms/micons/purple-dot.png";

              angular.extend(newLandfill, $scope.addlandfillInfo);
              //console.log(angular.toJson(newLandfill));
              newLandfill.$save().then(function(response){
                //console.log("Response:"+angular.toJson(response));
                data.push(response);
                $scope.tableParams.reload();
                $scope.successShow = true;
                $timeout(function () { $scope.successShow = false; },5000);
              }, function(reason) {
                    $scope.failShowGet = true;
                    $timeout(function() { $scope.failShowGet = false;}, 5000);
              });

              $scope.addlandfillInfo.id = "";
              $scope.addlandfillInfo.name = "";
              $scope.addlandfillInfo.phone = "";
              $scope.addlandfillInfo.city = "";
              $scope.addlandfillInfo.street = "";
              $scope.addlandfillInfo.secondaryStreet = "";
              $scope.addlandfillInfo.city = "";
              $scope.addlandfillInfo.state = "";
              $scope.addlandfillInfo.postalCode = "";

              $scope.landForm.name.$dirty = false;
              $scope.landForm.street.$dirty = false;
              $scope.landForm.secondaryStreet.$dirty = false;
              $scope.landForm.city.$dirty = false;
              $scope.landForm.state.$dirty = false;
              $scope.landForm.street.$dirty = false;
              $scope.landForm.postalCode.$dirty = false;
              $scope.landForm.phone.$dirty = false;

        }
        else{
              $scope.landForm.name.$dirty = true;
              $scope.landForm.street.$dirty = true;
              $scope.landForm.secondaryStreet.$dirty = true;
              $scope.landForm.city.$dirty = true;
              $scope.landForm.state.$dirty = true;
              $scope.landForm.street.$dirty = true;
              $scope.landForm.postalCode.$dirty = true;
              $scope.landForm.phone.$dirty = true;
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
          //https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE&libraries=places&sensor=false"
          script.src = 'http://maps.google.com/maps/api/js?sensor=false';
          document.body.appendChild(script);
    }
/* google map */

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
             $scope.landfillData = params.filter() ? $filter('filter')(data, params.filter()) : data;
             $defer.resolve($scope.landfillData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
             params.total($scope.landfillData.length); // set total for recalc pagination

             }
           });
    });
})
// End of landfill ********************************************************************************************************
