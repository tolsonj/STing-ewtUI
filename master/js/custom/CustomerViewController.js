App.controller('CustomerViewController', function($scope, $state, $window, $filter, ngTableParams, ngDialog, Customers, Orders) {
    $scope.customer = {
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


  $scope.customer.name = "Jack Tolson";
  $scope.customer.phone = "404-231-2232";
  $scope.customer.id = "1";
  $scope.customer.street = "443 Main Street";
  $scope.customer.secondaryStreet = "Suite 101";
  $scope.customer.city = "Duluth";
  $scope.customer.state = "Georgia";
  $scope.customer.postalCode = "30039";
  $scope.customer.website = "tcusit.com";
  $scope.customer.federalTaxId = "432-322332";
  $scope.customer.fax = "432-322332";
  $scope.customer.notes = "Notes are the key to success";


  var data = Orders.query();

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
       var orderedData = params.filter() ?
       $filter('filter')(data, params.filter()) : data;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(),  params.page() * params.count()));

       params.total(orderedData.length); // set total for recalc pagination

     }
   });
   });
  // $scope.customer = Customers.get(1); //fetch all movies. Issues a GET to /api/movies

})

// End of Customer ********************************************************************************************************
