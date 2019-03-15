

App.factory('ShoppingCart', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "shoppingcart";
  // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
  //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  //console.log("product endpoint: " + endpoint);

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

App.factory('ShoppingProducts', function($resource, $rootScope) {
  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "containers";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "product";
  // var endpoint =  "http://10.1.2.77\:8080/" + $rootScope.apiMCF + "containers";
  //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  //console.log("product endpoint: " + endpoint);

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


App.controller('shoppingController', function($scope, $state, $window,$timeout,  $filter, ngTableParams, ngDialog, ShoppingProducts, ShoppingCart,  Flash) {

  $scope.showallItem = true;
  $scope.showselectedItem = false;
  $scope.qty_txtbox = false;
  $scope.qty_dropbox = true;
  var data = ShoppingProducts.query(function(res){
   //console.log("data");
   //console.log(angular.toJson(res));
  },function(error){
    //console.log("error");
    //console.log(error);
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
/***********************************************************Header Cart ***************************************************************************************/

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
    //console.log($scope.totItems);
  });

  };
init();

/**********************************************************Common functions*************************************************************************************/
$scope.goShoppingcart = function() {
 $state.go('app.cartItem');
};

/*******************************************************shopping div ****************************************************************************************/
  $scope.countord = 0;
  $scope.callfn = function(getid, getprice) {
  //  console.log(getid +" - "+ getprice);
   angular.forEach(data, function(value, key){
     //console.log(value);
     if(value.id == getid ){
       $scope.countord++;
       //console.log(value.price);
      // console.log( $scope.countord);
      // var ss = value.price *
      $scope.total = $scope.countord * value.price;
       //console.log($scope.total);
     }

   });
  };


   $scope.viewProduct = function(product) {
  //  $state.go('app.product');
  $scope.getAllItems = product;
  $scope.itemPrice = $scope.getAllItems.price;
  $scope.itemId = $scope.getAllItems.id;
  //console.log(product.imageUrl);
  //console.log(product.id);
  $scope.showselectedImage = product.imageUrl;
    $scope.showselectedItem = true;
    $scope.showallItem = false;
  };


 $scope.countord1 = 0;
 $scope.countItems = function() {
      $scope.countord1++;
 };



 /************************************************************Cart Div**************************************************************************/

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

 $scope.productQty = 0;  $scope.totPrice = 0;
 $scope.getQuantity = function(qty){
    //console.log($scope.cartQuantity);
  //  var math= parseInt(qty) + parseInt($scope.cartQuantity);
    $scope.productQty = qty;
    $scope.totPrice = $scope.productQty *  $scope.itemPrice;
    //  alert($scope.cartitemPrice);
    if(qty >= 10){
        $scope.qty_txtbox = true;
        $scope.qty_dropbox = false;
    }
 };


$scope.gotoStore = function() {
  //alert("go back store");
 //  $state.go('app.shopping');
 $scope.showallItem = true;
 $scope.showselectedItem = false;
};

$scope.addtoCart = function(){
  //alert($scope.prdtqty);
    if($scope.prdtqty == undefined){
      $scope.productQty = $scope.productQty;
    }
    else{
      $scope.productQty = $scope.prdtqty;
    }
    var id = cart_info.length + 1;
    var found = cart_info.some(function (el) {
        $scope.gtqyt = el;
        $scope.getcartId = el.id;

      return $scope.itemId === el.productId;
    });
    if (!found) {
      console.log("Not Found");
      var shoppingcart = new ShoppingCart();
      var obj = {};
      obj['id'] = $scope.itemId;
      shoppingcart.product = obj;
      shoppingcart.quantity = $scope.productQty;
      console.log(angular.toJson(shoppingcart));
      shoppingcart.$save().then(function(response){
        console.log(response);
      },function(error){

      });
     }
     if (found) {
       console.log("Found");
       console.log($scope.gtqyt.quantity);
       var shoppingcart = new ShoppingCart();
       var obj = {};
       obj['id'] = $scope.itemId;
       shoppingcart.product = obj;

       $scope.totQuantity = parseInt($scope.gtqyt.quantity) + parseInt($scope.productQty);
       shoppingcart.quantity =   $scope.totQuantity;
       console.log(angular.toJson(shoppingcart));

       console.log($scope.getcartId);
       shoppingcart.$update({id: $scope.getcartId}).then(function(response){
        //  console.log(response);
        },function(error){

        });
      }

    /*  if(cart_info === undefined || cart_info.length == 0){
        console.log("else");
        //  console.log("else" +value.id +" != "+ $scope.itemId);
        var shoppingcart = new ShoppingCart();
        var obj = {};
        obj['id'] = $scope.itemId;
        shoppingcart.product = obj;
        shoppingcart.quantity = $scope.productQty;
        console.log(angular.toJson(shoppingcart));
        shoppingcart.$save().then(function(response){
          console.log(response);
        },function(error){

        });
      }*/
      $state.go('app.cartItem');
};






$scope.buynow = function(){
    $state.go('app.payment');
};


});



// End of Orders ********************************************************************************************************
