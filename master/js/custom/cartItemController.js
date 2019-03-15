
App.factory('ShoppingCart', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "shoppingcart";
  // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("shoppingcart endpoint: " + endpoint);

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

App.controller('cartController', function($scope, $state, $window,$timeout,$interval,$timeout,  $filter, ngTableParams, ngDialog, ShoppingCart,  Flash) {


  $scope.qty_txtbox = false;
  $scope.qty_dropbox = true;
  $scope.showuptbtn = false;


  var data = ShoppingCart.query(function(res){
  //console.log("data");
   //console.log(angular.toJson(res));
  },function(error){
    //console.log("error");
    //console.log(error);
    $scope.failShowGet = true;
  });

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
              $scope.cartData = params.filter() ?
              $filter('filter')(data, params.filter()) : data;
              $defer.resolve(	$scope.cartData.slice((params.page() - 1) * params.count(),
              params.page() * params.count()));
              params.total(	$scope.cartData.length); // set total for recalc pagination
              }
            });
  });
  //$scope.Timer =   $interval( function(){     $scope.reload_table(); },5000);


  $scope.reload_table = function() {
				data_reload = ShoppingCart.query();
				data_reload.$promise.then(function (data_new) {
						angular.extend(data, data_new);
						//  console.log("data to angular json::"+angular.toJson(data));
						//console.log("data length::"+data.length);
						$scope.tableParams.total(data.length);
						$scope.tableParams.reload();
				});
        //  init();
	};
  $scope.ShoppingCart = ShoppingCart.query();

  var cart_info = $scope.ShoppingCart;
  cart_info.$promise.then(function(cart_info) {
    console.log("cart_info");

    if (cart_info === undefined || cart_info.length == 0) {
      $scope.cartQuantity = 0;
      $scope.cartitemPrice = 0;
       console.log("IF  cart_info");
       console.log(cart_info);
    }else{
      $scope.cartQuantity = cart_info[0].quantity;
      $scope.cartitemPrice = cart_info[0].price;
      console.log("else  cart_info");
      console.log(cart_info);
      //console.log(cart_info[0].quantity);
    }

  });
  $scope.countord = 0;
var init = function () {
  $scope.loggedUser = [];
  $scope.totItemQuantity = [];
  var getUSERDATA =  ShoppingCart.query();
  getUSERDATA.$promise.then(function (getUSERDATA) {
    angular.forEach(getUSERDATA, function(value, key){
      //console.log("value");
      //console.log(value);
      $scope.subtotal = value.quantity * value.price;
      //console.log($scope.subtotal);
      $scope.loggedUser.push($scope.subtotal);
      $scope.totItemQuantity.push(value.quantity);
      //console.log($scope.loggedUser);
      //console.log($scope.totItemQuantity);




    });
    $scope.sum = $scope.loggedUser.reduce(add, 0);
    function add(a, b) {
        return a + b;
    }
    $scope.totItems = $scope.totItemQuantity.reduce(addqty, 0);
    function addqty(a, b) {
        return a + b;
    }
    //console.log("sum");
    //console.log($scope.sum);
  //  console.log($scope.totItems);
  });
        $scope.reload_table();
  };
  init();
  $scope.showacceptation ={};

  $scope.productQty = 0;  $scope.totPrice = 0;
  $scope.getQuantity = function(qty,idx){
      $scope.showacceptation[idx] = true;
      $scope.productQty = qty;
    //  $interval.cancel($scope.Timer);
  };

  $scope.updateCart = function(cartqty,cartitem,idx){
    //alert("s"+itemid)
      //$interval.cancel($scope.Timer);
      $scope.showacceptation[idx] = false;
      $scope.cartprdtqty = cartqty;
      $scope.cartproductId = cartitem.productId;
      $scope.cartId = cartitem.id;
         var shoppingcart = new ShoppingCart();
         var obj = {};
         obj['id'] = $scope.cartproductId;
         shoppingcart.product = obj;
         $scope.totQuantity = $scope.cartprdtqty;
         shoppingcart.quantity =   $scope.totQuantity;
         console.log(angular.toJson(shoppingcart));
         shoppingcart.$update({id: $scope.cartId}).then(function(response){
           //  console.log(response);
          // $scope.Timer =   $interval( function(){   $scope.reload_table(); },5000);
           init();
           $scope.reload_table();
         },function(error){

         });

    };


   $scope.viewProduct = function() {
    //$state.go('app.product');
   };
   $scope.goShoppingcart = function() {

    $state.go('app.cartItem');
   };


  $scope.buynow = function(){
      $state.go('app.payment');
  };


  $scope.delIteminCart = function(custName) {
      var row = this.$parent.cartItem;
      var index = data.indexOf(row);
      console.log('Delete'+index);
      console.log(row);

      var driverDeleteInstance = new ShoppingCart;
      angular.extend(driverDeleteInstance, data[index]);
      driverDeleteInstance.$destroy({
        id: custName
      }).then(function(response) {
        data.splice(index, 1);
        $scope.tableParams.reload();
        init();
      }, function(error) {
          $scope.failShowGet = true;
          $timeout(function() {
            $scope.failShowGet = false;
          }, 5000);
      });
  };



});



// End of Orders ********************************************************************************************************
