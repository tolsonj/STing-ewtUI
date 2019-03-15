// Customer ********************************************************************************************************


 App.factory('Drivers', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "drivers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "drivers";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

      return $resource(endpoint, {  }, {
		query: {method: 'GET', isArray: true, headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))} },
		save: {method: 'POST',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/drivers', params: {} },
		update: { method: 'PUT',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/drivers/:id', params: {id: '@_id'} },
		destroy: { method: 'DELETE',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/drivers/:id', params: {id: '@_id'}}

  //  http://localhost:8080/MCF_backend/myfile/uploading
    });
});

App.controller('DriverController', function($scope, $state, $window,$timeout,  $filter, ngTableParams, ngDialog, Drivers, Company, Flash) {
    $scope.driverInfo = {
        name: "",
        driverLicenseState: "",
        driverLicenseNumber: "",
        id: "",
        street: "",
        /*secondaryStreet: "",*/
        city: "",
        state: "",
        postalCode: "",
        phone: "",
    };
  $scope.titleEnabled = true;
	$scope.successShow = false;
	$scope.failShowGet = false;
  $scope.uptsuccessShow = false;

    $scope.company = Company.query();
    var company_info = $scope.company;
    company_info.$promise.then(function(company_info) {
      $scope.company_id = company_info.id;
    });

    var data = Drivers.query(function(res){
     console.log(data);
    },function(error){
      $scope.failShowGet = true;
    });

    $scope.editDialog = function (editable) {
	    var driver = this.$parent.driver;
			driver.isEditing = editable;
			var index = data.indexOf(driver);
			driver.editdriverInfo = {};
			driver.editdriverInfo.id = driver.id;
			driver.editdriverInfo.name = driver.name;
			driver.editdriverInfo.street = driver.street;
			//driver.editdriverInfo.secondaryStreet = driver.secondaryStreet;
			driver.editdriverInfo.city = driver.city;
			driver.editdriverInfo.state = driver.state;
			driver.editdriverInfo.postalCode = driver.postalCode;
			driver.editdriverInfo.phone = driver.phone;
	};
	 $scope.saveDialog = function () {
		 if(this.$parent.driver.userForm.$valid){
			    var driver = this.$parent.driver;
			    driver.isEditing = false;
			    var index = data.indexOf(driver);
          var str = document.getElementById("editfilename").value;
          var rest = str.substring(0, str.lastIndexOf("\\") + 1);
          var imgname = str.substring(str.lastIndexOf("\\") + 1, str.length);
          var rest1 = str.substring(0, str.lastIndexOf(".") + 1);
          var imgtype = str.substring(str.lastIndexOf(".") + 1, str.length);
          var savedriver = new Drivers;
          $scope.getdvrId = driver.editdriverInfo.id;
          //if(imgtype !=""){  $scope.uploadImgEdit($scope.getdvrId);}

			    savedriver.id = driver.editdriverInfo.id;
          //savedriver.imageUrl = "Driver"+savedriver.id+"."+imgtype;
			    savedriver.name = driver.editdriverInfo.name;
			    savedriver.street = driver.editdriverInfo.street;
			    //savedriver.secondaryStreet = driver.editdriverInfo.secondaryStreet;
			    savedriver.city = driver.editdriverInfo.city ;
			    savedriver.state = driver.editdriverInfo.state;
			    savedriver.postalCode = driver.editdriverInfo.postalCode;
			    savedriver.phone = driver.editdriverInfo.phone;
          savedriver.company = $scope.company_id;
          if(imgtype !=""){savedriver.imageUrl = "Driver"+savedriver.id+"."+imgtype;}

          //alert(savedriver.imageUrl);
          //$timeout(function() {$scope.uploadImg($scope.getdvrId);}, 5000);
			    console.log("Edit:"+angular.toJson(savedriver));
          angular.extend(driver, driver.editdriverInfo);
	         $scope.tableParams.reload();
           //  $scope.uploadImg($scope.getdvrId);
		      //	var driverUpdateInstance = new Drivers;
		      //	angular.extend(driverUpdateInstance, data[index]);
			    savedriver.$update({id:data[index].id}).then(function(response){
              console.log("RESPONSE"+ angular.toJson(response));
              response.imageUrl = response.imageUrl;
                $timeout(function() {$scope.reload_driver();}, 3000);
            //  $scope.reload_driver();
              $scope.uptsuccessShow = true;
              $timeout(function() {$scope.uptsuccessShow = false;}, 5000);
          },function(reason){
              $scope.failShowGet = true;
			        $timeout(function() { $scope.failShowGet = false;}, 5000);
          });

		 }
		 else{
			 this.$parent.driver.submitted = true;
		 }

   };


$scope.imgupload = function(id){
    //alert("upload"+id);
    $scope.uploadImgEdit(id);
}

$scope.deleteDialog = function (dvrName,dvrid) {
	$scope.getdvrName = dvrName;
  $scope.uploadImgdelete(dvrid);
	var row = this.$parent.driver;
    ngDialog.openConfirm({
      template: 'deleteDialogId',
      className: 'ngdialog-theme-default',
      preCloseCallback: 'preCloseCallbackOnScope',
      scope: $scope
    }).then(function (value) {
				console.log('Delete');
				// deleted from browser
				var index = data.indexOf(row);
				var driverDeleteInstance = new Drivers;
				angular.extend(driverDeleteInstance, data[index]);
				driverDeleteInstance.$destroy({id:data[index].id}).then(function(response){
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
             var driverDeleteInstance = new Drivers;
             angular.extend(driverDeleteInstance, $scope.multiple_del[i]);
             driverDeleteInstance.$destroy({id:dataId}).then(function(response){
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
       angular.forEach($scope.driverData, function(item) {
            console.log("item");console.log(item);
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
           console.log("$scope.checkboxes.checked");
           console.log($scope.checkboxes.checked);
       }
       // grayed checkbox
       angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
       $scope.deleteSelectedRows();
   }, true);

/*Selecet all rows and delete code ends*/




  $scope.getcount = function(param) {
  	$scope.countord = 0;
  	angular.forEach(data, function(value, key){
  			$scope.countord++;
  			console.log($scope.countord);
    });
  	return $scope.countord;
  };

 $scope.addDialog = function () {
    $timeout(function() { $scope.calSleep();}, 2000);
    $scope.getcount();
    if($scope.driverInfo.name == ""){
        $scope.titleEnabled = false;
    }
    else if($scope.driverInfo.phone == ""){
        $scope.titleEnabled = false;
    }
    else if(($scope.driverInfo.name != "") && ($scope.driverInfo.phone != "" )){
        var str = document.getElementById("filename").value;
        var rest = str.substring(0, str.lastIndexOf("\\") + 1);
        var imgname = str.substring(str.lastIndexOf("\\") + 1, str.length);
        var rest1 = str.substring(0, str.lastIndexOf(".") + 1);
        var imgtype = str.substring(str.lastIndexOf(".") + 1, str.length);
        $scope.dvrId=$scope.countord+1;

		    var newDriver = new Drivers;
        newDriver.id = $scope.driverInfo.id;
        //newDriver.imageUrl = "Driver"+$scope.dvrId+"."+imgtype;
        //alert(newDriver.imageUrl);
        newDriver.name = $scope.driverInfo.name;
        newDriver.phone = $scope.driverInfo.phone;
        newDriver.street = $scope.driverInfo.street;
        //newDriver.secondaryStreet = $scope.driverInfo.secondaryStreet;
        newDriver.city = $scope.driverInfo.city;
        newDriver.state = $scope.driverInfo.state;
        newDriver.postalCode = $scope.driverInfo.postalCode;
        newDriver.company = $scope.company_id;
	      //	angular.extend(newDriver, $scope.driverInfo);
		    console.log(angular.toJson(newDriver));
		    newDriver.$save().then(function(response){
		    console.log("Response:"+angular.toJson(response));
        console.log(response.id);
        $scope.getdvrId = response.id;
        //  response.imageUrl = "Driver"+response.id+"."+imgtype;
		    data.push(response);
		    $scope.tableParams.reload();
        $scope.successShow = true;
        $scope.titleEnabled = true;
        $scope.titleEnabled = true;
        $scope.uploadImg($scope.getdvrId);
        // $scope.reload_driver();
          $timeout(function() {$scope.reload_driver();}, 2000);
         $scope.tableParams.reload();
 		     $timeout(function () {$scope.successShow = false;},5000);
	  }, function(reason) {
        $scope.failShowGet = true;
        $timeout(function() { $scope.failShowGet = false;}, 5000);
		});

        $scope.driverInfo.name = "";
        $scope.driverInfo.driverLicenseState = "";
        $scope.driverInfo.driverLicenseNumber = "";
        $scope.driverInfo.city = "";
        $scope.driverInfo.street = "";
        //$scope.driverInfo.secondaryStreet = "";
        $scope.driverInfo.state = "";
        $scope.driverInfo.postalCode = "";
        $scope.driverInfo.phone = "";
        document.getElementById("preimg").value = "";
        document.getElementById("preimg").innerHTML = ""; //filename

      //  document.getElementById("preimg").value = "";
        $scope.stepsModel = [];
		    $scope.successShow = true;
		    $timeout(function () {$scope.successShow = false;	document.getElementById("filename").value = "";
        document.getElementById("filename").innerHTML = "";},5000);

  }
};


   // watch for check all checkbox
   data.$promise.then(function (data) {
   $scope.tableParams = new ngTableParams({
     page: 1,            // show first page
     count: 10,          // count per page
     filter: {
        //orderdata :'50'       // initial filter
     }
   }, {
     total: data.length, // length of data
     getData: function($defer, params) {
       // use build-in angular filter
      $scope.driverData = params.filter() ? $filter('filter')(data, params.filter()) : data;
      $defer.resolve($scope.driverData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));
      params.total($scope.driverData.length); // set total for recalc pagination
     }
   });
   });
   $scope.reload_driver = function() {
  //   alert(" $scope.reload_driver")
 				data_reload = Drivers.query();
 				data_reload.$promise.then(function (data_new) {
 						angular.extend(data, data_new);
 						  console.log("data to angular json::"+angular.toJson(data));
 						console.log("data length::"+data.length);
 						$scope.tableParams.total(data.length);
 						$scope.tableParams.reload();
 				});
 	}


/*Image upload function starts*/
   $scope.uploadImg = function(driverIdval){
          //  alert("Title was clicked ADD" );
              var oData = new FormData(document.forms.namedItem("fileinfo"));

                 //var url="${createLink(controller:'myfile1',action:'uploading')}";
               var url='http://localhost:8080/MCF_backend/driverImage/uploading'+'?driverImgId='+driverIdval;
                  $.ajax({
                      url:url,
                      type:'POST',
                      data:oData,
                      beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', JSON.parse(localStorage.getItem('token'))); } ,
                      processData: false,  // tell jQuery not to process the data
                      contentType: false ,
                      success:function (req) {
                          //  alert(req);
                         }
                      });
                    //    document.getElementById("filename").value = "";
    };
    $scope.uploadImgEdit = function(driverIdval){
                  // alert("Title was clicked EDIT CTRL" );
                  // alert("hello world Edit " + driverIdval );
                    var oData = new FormData(document.forms.namedItem("fileinfo1"));
                    //$timeout(function() { $scope.calSleep();}, 2000);
                       //var url="${createLink(controller:'myfile1',action:'uploading')}";
                     var url='http://localhost:8080/MCF_backend/driverImage/uploading'+'?driverImgId='+driverIdval;
                        $.ajax({
                            url:url,
                            type:'POST',
                            data:oData,
                            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', JSON.parse(localStorage.getItem('token'))); } ,
                            processData: false,  // tell jQuery not to process the data
                            contentType: false ,
                            success:function (req) {
                                //  alert(req);
                               }
                            });
                        $timeout(function() { $scope.calSleep();}, 2000);
                           //    document.getElementById("filename").value = "";
      };


    $scope.uploadImgdelete = function(dvrId){
          var getdvrid = dvrId;
          var oData = new FormData(document.forms.namedItem("fileinfo1"));
           var url='http://localhost:8080/MCF_backend/driverImage/delete'+'?driverImgId='+getdvrid;
              $.ajax({
                  url:url,
                  type:'DELETE',
                  data:oData,
                  beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', JSON.parse(localStorage.getItem('token'))); } ,
                  processData: false,  // tell jQuery not to process the data
                  contentType: false ,
                  success:function (req) {
                      //  alert(req);
                     }
                  });
              $timeout(function() { $scope.calSleep();}, 2000);
                 //    document.getElementById("filename").value = "";
    };
    /*Image upload function ends*/
    /*Image preview starts*/

    $scope.stepsModel = [];
    $scope.imageUpload = function(element){
              var reader = new FileReader();
              reader.onload = $scope.imageIsLoaded;
              reader.readAsDataURL(element.files[0]);
    }
    $scope.imageIsLoaded = function(e){
              $scope.$apply(function() {
              $scope.stepsModel.push(e.target.result);
              });
    }
   $scope.calSleep = function(){

   };
/*Image preview ends*/


});
