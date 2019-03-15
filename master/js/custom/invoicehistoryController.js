// InvoiceHistory ********************************************************************************************************
App.factory('InvoiceDetails', function($resource, $rootScope) {
  //var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "payment/makePayment";

  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF +
    "InvoiceDetail";
  //http://localhost:8080/MCF_backend/InvoiceDetail/getInvoiceDetail?invoiceNumber=264034

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      isArray: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl + $rootScope.apiMCF +
        'InvoiceDetail/getInvoiceDetail?invoiceNumber=:invNum',
      params: {
        invNum: '@_invNum'
      }
    },
    save: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
      url: $rootScope.serverUrl +
        'MCF_backend/payment/makePaymentAuthorizeDotNet',
      params: {}
    }
  });
});

App.factory('CardPayment', function($resource, $rootScope) {
  //var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "payment/makePayment";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF +
    "payment/makePaymentAuthorizeDotNet";
  //http://localhost:8080/MCF_backend/payment/makePaymentAuthorizeDotNet

  return $resource(endpoint, {}, {
    query: {
      method: 'GET',
      isArray: false,
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
      url: $rootScope.serverUrl +
        'MCF_backend/payment/makePaymentAuthorizeDotNet',
      params: {}
    }
  });
});



App.controller('invoicehistoryController', function($scope, $state, $window,
  $timeout, $interval, ngDialog, $filter, ngTableParams, CardPayment,
  $resource,
  $rootScope, InvoiceDetails) {

  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "invoice";
  var InvoiceHistory = $resource(endpoint, {}, {
    query: {
      method: 'GET',
      params: {},
      isArray: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }
    }
  });

  $scope.creditCardInfo = {
    ccname: "",
    ccnumber: "",
    ccexpmonth: "",
    ccexpyear: "",
    ccverification: "",
    invoiceId: "",
    billStreet: "",
    billCity: "",
    billState: "",
    billZip: "",
    billComment: ""
  };

  $scope.successShow = false;
  $scope.failShowGet = false;
  $scope.uptsuccessShow = false;
  $scope.onLoadspinnerShow = true;

  $scope.names = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY"
  ];

  var data_promise = InvoiceHistory.query(function(res) {
    //console.log("success");
    // console.log(res);
  }, function(error) {
    $scope.failShowGet = true;
    console.log("error");
    //console.log(error);
  });

  var data;
  // watch for check all checkbox
  data_promise.$promise.then(function(data_invoice) {
    var data_invoice = data_invoice.data;
    $scope.tableParams = new ngTableParams({
      page: 1, // show first page
      count: 10, // count per page
      filter: {
        // status:'H'       // initial filter
      }
    }, {
      total: data_invoice.length, // length of data
      getData: function($defer, params) {
        data = params.filter() ? $filter('filter')(
          data_invoice, params.filter()) : data_invoice;
        $defer.resolve(data.slice((params.page() - 1) * params.count(),
          params.page() * params.count()));
        params.total(data.length); // set total for recalc pagination


        $scope.onLoadspinnerShow = false;

      }
    });
  });


  $scope.subtotal = function() {
    $scope.subtot = $scope.invoiceObj.amount;
    return $scope.subtot;
  }

  $scope.tax = function() {

    var taxval = 0.21 * parseFloat($scope.subtot);
    taxval = parseFloat(taxval).toFixed(2);
    $scope.taxval = taxval;
    console.log("subtot==>" + $scope.subtot);
    console.log("TAX==>" + $scope.taxval);
    return taxval;



  }


  $scope.grandTotal = function() {

    var grandtot = parseFloat($scope.taxval) + parseFloat($scope.subtot);
    $scope.grandtot = parseFloat(grandtot);
    grandtot = parseFloat(grandtot).toFixed(2);
    return grandtot;



  }

  $scope.showInvoiceDetails = function(company_name, admin_name, invoiceObj) {
    $timeout(function() {
      console.log(invoiceObj.invNum);
      $scope.invNum = invoiceObj.invNum;
      $scope.invoiceObj = invoiceObj;
      var invoice_data = "";
      invoice_data = InvoiceDetails.query({
        invNum: invoiceObj.invNum
      });
      $scope.invoiceData = [];

      invoice_data.$promise.then(function(data) {
        console.log("invoice_data");
        console.log(angular.toJson(data));
        $scope.invoiceData = data;

      });



      console.log(invoice_data);
      ngDialog.openConfirm({
        template: 'invoiceDetailId',
        className: 'ngdialog-theme-default custom-width',
        preCloseCallback: 'preCloseCallbackOnScope',
        scope: $scope
      }).then(function(value) {

      }, function(reason) {

      })

    }, 200);
  };


  $scope.paymentDialog = function(company_name, admin_name, invoiceObj,
    index) {

    console.log('invoice details==>' + angular.toJson(invoiceObj));

    $('.ngdialog.ngdialog-theme-default .ngdialog-content').attr(
      'css',
      '');

    var amt = invoiceObj.amount;
    $scope.creditCardInfo.invoiceId =
      invoiceObj.id;
    $scope.payAmount = amt;
    ngDialog.openConfirm({
      template: 'paymentDialogId',
      className: 'ngdialog-theme-default',
      preCloseCallback: 'preCloseCallbackOnScope',
      scope: $scope
    }).then(function(value) {
        $scope.carno = $scope.creditCardInfo.ccnumber;
        $scope.carnoStr = $scope.carno.toString();
        $scope.last4digit = $scope.carnoStr.substr($scope.carnoStr.length -
          4);

        $scope.confirmPay(company_name, admin_name, invoiceObj, index);
      },
      function(reason) {
        console.log('Cancel');
      });
  };


  $scope.spinnerShow = false;
  $scope.confirmPay = function(company_name,
    admin_name, invoiceObj,
    index) {

    $scope.invNumConfirm = invoiceObj.invNum;
    $scope.payAmount = $scope.creditCardInfo.ccamt;


    ngDialog.openConfirm({
      template: 'confirmPayment',
      className: 'ngdialog-theme-default custom-width',
      preCloseCallback: 'preCloseCallbackOnScope',
      scope: $scope
    }).then(function(value) {
        //$scope.paymentDialog();
        $scope.spinnerShow = true;
        var newcardPayment = new CardPayment();
        newcardPayment.custNum = invoiceObj.custNum;
        newcardPayment.company_name = $scope.creditCardInfo.company_name;
        newcardPayment.fname = $scope.creditCardInfo.fname;
        newcardPayment.lname = $scope.creditCardInfo.lname;
        newcardPayment.cardNumber = $scope.creditCardInfo.ccnumber;
        newcardPayment.expirationDate = "" + $scope.creditCardInfo.ccexpmonth +
          "" + $scope.creditCardInfo.ccexpyear;
        newcardPayment.cardCode = $scope.creditCardInfo.ccverification;
        newcardPayment.amount = $scope.payAmount;
        newcardPayment.email = $scope.creditCardInfo.email;
        newcardPayment.invoiceId = $scope.creditCardInfo.invoiceId;

        newcardPayment.billStreet = $scope.creditCardInfo.billStreet;
        newcardPayment.billCity = $scope.creditCardInfo.billCity;
        newcardPayment.billState = $scope.creditCardInfo.billState;
        newcardPayment.billZip = $scope.creditCardInfo.billZip;
        newcardPayment.billComment = $scope.creditCardInfo.billComment;

        //newcardPayment.token = response.id;
        console.log("newcardPayment: " + angular.toJson(newcardPayment));
        newcardPayment.$save().then(function(response) {

          console.log(response);
          console.log("Response:" + angular.toJson(response));
          $scope.authres = response;



          $scope.spinnerShow = false;
          // var data_change 	  = InvoiceHistory.query(function(res) {

          //var data = res;
          var string = response.message;
          $scope.message = response.message;
          console.log("string==>" + angular.toJson($scope.invoice_data));


          if (string.indexOf("Successful.") !== -1) {
            invoiceObj.hasPaid = true;
            angular.extend(data[index], invoiceObj);
            console.log('Successful');
            $scope.successShow = true;

          } else {
            $scope.failShowGet = true;
            $scope.message = response.errorMessage;
          }



          $timeout(function() {
            $scope.successShow = false;
            $scope.failShowGet = false;


          }, 3000);


          $scope.creditCardInfo.ccnumber = "";
          $scope.creditCardInfo.ccname = "";
          $scope.creditCardInfo.ccexpmonth = "";
          $scope.creditCardInfo.ccexpyear = "";
          $scope.creditCardInfo.ccverification = "";
          $scope.creditCardInfo.billComment = "";
          $scope.creditCardInfo.amount = "";


        }, function(reason) {
          $scope.failShowGet = true;
          $scope.message =
            "Your transaction failed. Please try after few minutes";
          $timeout(function() {
            $scope.failShowGet = false;
          }, 5000);
        });
      },
      function(reason) {
        console.log('Cancel');
      });
  };


});

// End of InvoiceHistory ********************************************************************************************************
