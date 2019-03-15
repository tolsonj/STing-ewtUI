

App.factory('BuyItem', function($resource, $rootScope) {
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "payment/makePayment";

  return $resource(endpoint, {}, {
  		query: {method: 'GET', isArray: false, headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}  },
      save: {method: 'POST',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/payment/makePayment', params: {}}
      });
});

App.factory('CartAmount', function($resource, $rootScope) {
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "payment/getAmountToPay";

  return $resource(endpoint, {}, {
  		query: {method: 'GET', isArray: false, headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}  },
      save: {method: 'POST',headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))}, url: $rootScope.serverUrl + 'MCF_backend/payment/getAmountToPay', params: {}}
      });
});

App.controller('paymentController', function($scope, $state, $window,
  $timeout, ngDialog, $filter, ngTableParams, BuyItem, CartAmount, $resource, $rootScope,$resource) {


$scope.authmsg = false;
  $scope.creditCardInfo = {
    ccname: "",
    ccnumber: "",
    ccexpmonth: "",
    ccexpyear: "",
    ccverification: ""
  };


  $scope.BuyItem = BuyItem.query(function(res) {
    console.log("success" +"cardPayment");
    console.log(res);
  }, function(error) {
    $scope.failShowGet = true;
    console.log("error");
    //console.log(error);
  });

    $scope.cartAmount = CartAmount.query(function(res) {
      console.log("success" +"CartAmount");
      console.log(res);
    }, function(error) {
      $scope.failShowGet = true;
      console.log("error");
      //console.log(error);
    });
  //  $scope.company = Company.query();
    var cartAmount_info =   $scope.cartAmount;
    cartAmount_info.$promise.then(function(cartAmount_info) {
      $scope.cartamt = cartAmount_info.amount;
      console.log($scope.cartamt);
    });
 $scope.cancel = function(){
   $state.go('app.shopping');
 }


  $scope.confirm = function(company_name, admin_name) {

          Stripe.setPublishableKey('pk_test_QvFlLp9Un3QZiyZHZYICN10Z');
          var $form = $('#payment-form');
          Stripe.card.createToken({
              number: $scope.creditCardInfo.ccnumber,
              exp_month: $scope.creditCardInfo.ccexpmonth,
              exp_year: $scope.creditCardInfo.ccexpyear,
              cvc: $scope.creditCardInfo.ccverification
          }, function(status, response) {
              // response.id is the card token.
              console.log(response);
              var newBuyItem = new BuyItem();
              //newBuyItem.amount = $scope.creditCardInfo.ccamt;
              newBuyItem.token = response.id;
              console.log(angular.toJson(newBuyItem));
              newBuyItem.$save().then(function(response){
                  console.log("Response:"+angular.toJson(response));
                  $scope.authmsg = true;
                  $timeout(function () { $scope.authmsg = false; },5000);
              }, function(reason) {
                  $scope.failShowGet = true;
                  $timeout(function() { $scope.failShowGet = false;}, 5000);
              });
        });
        $scope.creditCardInfo.ccname ="";
        $scope.creditCardInfo.ccnumber ="";
        $scope.creditCardInfo.ccexpmonth ="";
        $scope.creditCardInfo.ccexpyear ="";
        $scope.creditCardInfo.ccverification ="";
        $scope.creditCardInfo.ccamt = "";


  };

});


// End of InvoiceHistory ********************************************************************************************************
