

App.factory('Product', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "product";
  // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("product endpoint: " + endpoint);

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      params: {},
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


App.controller('productController', function($scope, $state, $window,$timeout,  $filter, ngTableParams, ngDialog, Product,  Flash) {

  var data = Product.query(function(res){
   console.log("data");
   console.log(angular.toJson(res));
  },function(error){
    console.log("error");
    console.log(error);
    $scope.failShowGet = true;
  });
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
    $scope.countord = 0;
      $scope.callfn = function() {
    	$scope.countord++;
    };

   $scope.go = function() {
     $state.go('app.reconcile');
   };

   $scope.gotoStore = function() {
      $state.go('app.shopping');
   };
   $scope.countord1 = 0;
   $scope.countItems = function() {
      	$scope.countord1++;
   };
   $scope.productQty = 0;  $scope.totPrice = 0;
   $scope.getQuantity = function(qty){
     $scope.productQty = qty;
     $scope.price = 20;
     $scope.totPrice = $scope.productQty *  $scope.price;

   };
   $scope.addtoCart = function(){

 $state.go('app.cartItem');
   };

   $scope.buynow = function(){
     $state.go('app.payment');


   }

});

// End of Orders ********************************************************************************************************
