// Customer ********************************************************************************************************


App.factory('Customers', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "customers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "customers";
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
    save: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl + 'MCF_backend/customers',
      params: {}
    },
    update: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl + 'MCF_backend/customers/:id',
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
      url: $rootScope.serverUrl + 'MCF_backend/customers/:id',
      params: {
        id: '@_id'
      }
    }
  });
});



App.controller('CustomerController', function($scope, $state, $window, $timeout,
  $filter, ngTableParams, ngDialog, Customers, Company, Orders) {
  $scope.addcust = {
    name: "",
    phone: "",
    id: "",
    street: "",
    secondaryStreet: "",
    city: "",
    state: "",
    postalCode: "",
    fax: "",
    website: "",
    federalTaxId: "",
    notes: ""
  };



  $scope.successShow = false;
  $scope.failShowGet = false;
  $scope.uptsuccessShow = false;


  $scope.company = Company.query();
  var company_info = $scope.company;
  company_info.$promise.then(function(company_info){
       $scope.company_id =  company_info.id;
  });

  var data = Customers.query(function(res) {
    console.log("success");
  }, function(error) {
    $scope.failShowGet = true;
    //$timeout(function() { $scope.failShowGet = false;}, 5000);
  });

  $scope.orders = Orders.query();

 function compare(a, b) {
    if (a.name < b.name)
        return -1;
    else if (a.name > b.name)
        return 1;
    else
        return 0;
 }

 $scope.mappedOrders = [];
 $scope.orders.$promise.then(function(results) {
    $scope.orders = results;
    $scope.orders.sort(compare);
    for (var i = 0, len = $scope.orders.length; i < len; i++) {
        console.log($scope.orders[i].CUSTOMER_ID);
        $scope.mappedOrders.push($scope.orders[i].CUSTOMER_ID);
        console.log("mapped"); console.log($scope.mappedOrders);
    }
 });

 $scope.findorders = function(ordersId) {
   for (var i = 0, len = $scope.orders.length; i < len; i++) {
       if ($scope.orders[i].CUSTOMER_ID == ordersId) return $scope.orders[i];
   }
 };


  $scope.editDialog = function(editable) {

    var customer = this.$parent.customer;
    customer.isEditing = editable;
    var index = data.indexOf(customer);

    customer.cust = {};
    customer.cust.id = customer.id;
    customer.cust.name = customer.name;

    customer.cust.street = customer.street;
    customer.cust.secondaryStreet = customer.secondaryStreet;

    customer.cust.phone = customer.phone;
    customer.cust.city = customer.city;
    customer.cust.state = customer.state;
    $scope.tableParams.reload();
  };

  $scope.saveDialog = function() {
    if (this.$parent.customer.userForm.$valid) {
      var customer = this.$parent.customer;
      customer.isEditing = false;
      var index = data.indexOf(customer);

      customer.id = customer.cust.id;
      customer.name = customer.cust.name;
      customer.street = customer.cust.street;
      customer.secondaryStreet = customer.cust.secondaryStreet;
      customer.phone = customer.cust.phone;
      customer.city = customer.cust.city;
      customer.state = customer.cust.state;
      customer.company = $scope.company_id ;
      console.log(angular.toJson(customer.cust));
      $scope.tableParams.reload();

      var cust = new Customers();
      angular.extend(cust, data[index]);
      cust.$update({
        id: data[index].id
      }).then(function(response) {
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
      this.$parent.customer.submitted = true;
    }
    /*	  var cust = new Customers
    	  angular.extend(cust, data[index]);
    	  cust.$update({id:data[index].id}); */
  };

  $scope.deleteDialog = function(custName) {
    $scope.getcustName = custName;
    var row = this.$parent.customer;
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
      /*  data.splice(index,1);
       $scope.tableParams.reload();
       Customers.delete({id: data[index].id});
	   */

      var driverDeleteInstance = new Customers;
      angular.extend(driverDeleteInstance, data[index]);
      driverDeleteInstance.$destroy({
        id: data[index].id
      }).then(function(response) {
        data.splice(index, 1);
        $scope.tableParams.reload();
      }, function(error) {
        $scope.failShowGet = true;
        $timeout(function() {
          $scope.failShowGet = false;
        }, 5000);
      });

    }, function(reason) {
      console.log('Cancel');
    });
  };

  $scope.addDialog = function() {

    if ($scope.customerForm.$valid) {

      var newCustomer = new Customers();
      newCustomer.name = $scope.addcust.name;
      newCustomer.phone = $scope.addcust.phone;
      newCustomer.city = $scope.addcust.city;
      newCustomer.street = $scope.addcust.street;
      newCustomer.secondaryStreet = $scope.addcust.secondaryStreet;
      newCustomer.city = $scope.addcust.city;
      newCustomer.state = $scope.addcust.state;
      newCustomer.postalCode = $scope.addcust.postalCode;
      newCustomer.fax = $scope.addcust.fax;
      newCustomer.website = $scope.addcust.website;
      newCustomer.federalTaxId = $scope.addcust.federalTaxId;
      newCustomer.notes = $scope.addcust.notes;
      newCustomer.company = $scope.company_id;
      console.log(angular.toJson(newCustomer));

      newCustomer.$save().then(function(response) {
        console.log("Response:" + angular.toJson(response));
        // data.push(response);
        data.splice(0, 0, response);
        $scope.tableParams.reload();
        $scope.successShow = true;
        $timeout(function() {
          $scope.successShow = false;
        }, 5000);
      }, function(reason) {
        $scope.failShowGet = true;
        $timeout(function() {
          $scope.failShowGet = false;
        }, 5000);
      });

      //  data.push(newCustomer);
      // $scope.tableParams.reload();


      $scope.addcust.name = "";
      $scope.addcust.phone = "";
      $scope.addcust.city = "";
      $scope.addcust.street = "";
      $scope.addcust.secondaryStreet = "";
      $scope.addcust.city = "";
      $scope.addcust.state = "";
      $scope.addcust.postalCode = "";
      $scope.addcust.fax = "";
      $scope.addcust.website = "";
      $scope.addcust.federalTaxId = "";
      $scope.addcust.notes = "";

      $scope.customerForm.name.$dirty = false;
      $scope.customerForm.street.$dirty = false;
      $scope.customerForm.secondaryStreet.$dirty = false;
      $scope.customerForm.city.$dirty = false;
      $scope.customerForm.state.$dirty = false;
      $scope.customerForm.street.$dirty = false;
      $scope.customerForm.postalCode.$dirty = false;
      $scope.customerForm.phone.$dirty = false;
      $scope.customerForm.fax.$dirty = false;
      $scope.customerForm.website.$dirty = false;
      $scope.customerForm.federalTaxId.$dirty = false;
      $scope.customerForm.notes.$dirty = false;



    } else {
      $scope.customerForm.name.$dirty = true;
      $scope.customerForm.street.$dirty = true;
      $scope.customerForm.secondaryStreet.$dirty = true;
      $scope.customerForm.city.$dirty = true;
      $scope.customerForm.state.$dirty = true;
      $scope.customerForm.street.$dirty = true;
      $scope.customerForm.postalCode.$dirty = true;
      $scope.customerForm.phone.$dirty = true;
      $scope.customerForm.fax.$dirty = true;
      $scope.customerForm.website.$dirty = true;
      $scope.customerForm.federalTaxId.$dirty = true;
      $scope.customerForm.notes.$dirty = true;
    }
  };



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

    data.sort(compare);
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
        $scope.customerData = params.filter() ? $filter('filter')(
          data, params.filter()) : data;
        $defer.resolve($scope.customerData.slice((params.page() - 1) *
          params.count(), params.page() * params.count()));
        params.total($scope.customerData.length); // set total for recalc pagination

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
              var customerInstance = new Customers;
              angular.extend(customerInstance, $scope.multiple_del[i]);
              customerInstance.$destroy({id:dataId}).then(function(response){
                console.log(response);
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
       angular.forEach($scope.customerData, function(item) {
            var index = $scope.mappedOrders.indexOf(item.id);
            console.log(item.id+ "!="+ $scope.mappedOrders[index]);
            if(item.id != $scope.mappedOrders[index] ){
                $scope.multiple_del.push(item);
              }
                console.log($scope.multiple_del);
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

});
