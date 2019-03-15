/**=========================================================
 * Module: access-recover.js
 * Demo for recover api
 =========================================================*/
App.factory('ResetPwd', function($resource, $rootScope) {
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "forgotpass";



   //console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
         params: {},
         isArray: false
      },
      save: {
         method: 'POST',
         //headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
         url: $rootScope.serverUrl + 'MCF_backend/forgotpass',
         params: {}
      },
   });
});

App.controller('PasswordRecoverController', ['$scope', '$http', '$state', '$timeout', 'ResetPwd', function($scope,
   $http, $state,
   $timeout, ResetPwd) {

   // bind here all data from the form
   $scope.account = {};
   // place the message if something goes wrong
   $scope.authMsg = '';
   $scope.msgPass = '';
   $scope.recover = function() {

      $scope.authMsg = '';
      if ($scope.recoverForm.$valid) {
         var newRecover = new ResetPwd();
         newRecover.username = $scope.recover.username;

         // $http
         //  .post('api/account/register', {username: $scope.account.username, password: $scope.account.password})
         newRecover.$save()
            .then(function(response) {
               console.log(response.message);
               $scope.msgPass = response.message;
               $timeout(function() {
                  location.href = '#/page/login';
               }, 7000);

            }, function(x) {
               $scope.authMsg = 'Reset Password Request Failed';
               $timeout(function() {
                  location.href = '#/page/login';
               }, 7000);
            });
      } else {
         $scope.recoverForm.username.$dirty = true;
      }
   };
}]);
