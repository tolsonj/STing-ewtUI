App.factory('ActivateUser', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "activateuser";
  //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  console.log("endpoint: " + endpoint);

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
      url: $rootScope.serverUrl + 'MCF_backend/activateuser',
      params: {}
    }
  });
});

App.factory('showInactiveUsers', function($resource, $rootScope) {

  // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
  var endpoint = $rootScope.serverUrl + $rootScope.apiMCF +
    "showinactiveusers";
  //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  //console.log("endpoint: " + endpoint);

  return $resource(endpoint, {}, {

    query: {
      method: 'GET',
      params: {},
      isArray: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }
    }
  });
});


App.controller('approvalController', function($scope, $state, $timeout, $window,
  $cookieStore, $filter, ngTableParams, ngDialog, showInactiveUsers,
  ActivateUser, Flash) {


  $scope.failShowGet = false;
  $scope.successShow = false;
  $scope.onLoadspinnerShow = true;
  //alert(userdata);

  $timeout(function() {
    $scope.onLoadspinnerShow = false;
  }, 3000);

  var data = showInactiveUsers.query(function(res) {

  }, function(error) {
    $scope.failShowGet = true;
    //$timeout(function() { $scope.failShowGet = false;}, 5000);
  });


  //$scope.loggedUser = data;
  //console.log(data);
  data.$promise.then(function(data) {
    $scope.tableParams = new ngTableParams({
      page: 1, // show first page
      count: 5, // count per page
      filter: {
        // status:'H'       // initial filter
      }
    }, {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var adminData = params.filter() ? $filter('filter')(data,
          params.filter()) : data;
        $defer.resolve(adminData.slice((params.page() - 1) *
          params.count(), params.page() * params.count()));
        params.total(adminData.length); // set total for recalc pagination
        $scope.onLoadspinnerShow = false;
        /*
				angular.forEach(data, function(value, key){
				$scope.uname = value.username;
				if(userdata === $scope.uname ){
					//console.log($scope.uname);
					$scope.loggedUser.push(value);
					console.log("GETDAT");
					//console.log($scope.loggedUser);
				}
			});
			*/

      }
    });



  });


  $scope.activeDialog = function(status, uname, id) {

    //alert("test"+uname + id);


    var row = this.$parent.user;
    var newactivateuser = new ActivateUser;
    newactivateuser.username = uname;
    //console.log(angular.toJson(newactivateuser));
    newactivateuser.$save().then(function(response) {
      //	console.log("approval response");
      //	console.log(response);
      var index = data.indexOf(row);
      //alert(index);
      //$scope.tableParams.reload();
      //$scope.tableParams.reload();
      data.splice(id, 1);
      $scope.successShow = true;
      $timeout(function() {
        $scope.successShow = false;
      }, 5000);
      //data.splice(index,1);
      $scope.tableParams.reload();
    }, function(reason) {
      $scope.failShowGet = true;
      $timeout(function() {
        $scope.failShowGet = false;
      }, 5000);
    });
  };



});
