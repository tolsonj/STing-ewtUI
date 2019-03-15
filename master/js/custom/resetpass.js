/**=========================================================
 * Module: access-recover.js
 * Demo for recover api
 =========================================================*/


App.factory('SetNewPwd', function($resource, $rootScope) {

   var url = document.location.toString();
   var str = url;
   var lastSlash = str.lastIndexOf("/");
   var strtoken = str.substring(lastSlash + 1);

   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "resetpass/" + strtoken;



   //console.log("endpoint: TEST " + endpoint);

   return $resource(endpoint, {}, {
      query: {
         method: 'GET',
         params: {},
         isArray: false
      },
      save: {
         method: 'POST',
         //headers: {'Content-Type': 'application/json','Authorization':JSON.parse(localStorage.getItem('token'))},
         url: $rootScope.serverUrl + 'MCF_backend/resetpass/' + strtoken,
         params: {}
      }
   });
});

App.controller('SetNewPassowrdcontroller', ['$scope', '$http', '$state', '$timeout', '$window', '$cookieStore',
   'SetNewPwd',
   function($scope, $http, $state, $timeout, $window, $cookieStore, SetNewPwd) {

      // bind here all data from the form
      $scope.recover = {};
      // place the message if something goes wrong
      $scope.authMsg = '';
      $scope.msgPass = '';
      $scope.showresetpage = false;

      $scope.checkreset = SetNewPwd.query(function(res) {
         console.log(res.message);
         if (res.message == "true") {
            $scope.showresetpage = true;
         } else if (res.message == "Invalid URL request") {
            $scope.invalidUser = true;
            $timeout(function() {
               $window.location.href = '#/page/recover';
            }, 4000);
         } else if (res.message == "URL timeout") {
            $scope.showtimeout = true;
            $timeout(function() {
               $window.location.href = '#/page/recover';
            }, 4000);
         }
      }, function(error) {
         console.log("ERROR");
         $scope.showtimeout = true;
         $scope.showreg = false;
         $scope.authMsg = 'Password Reset Failed';
      });



      $scope.resetpwd = function() {

         $scope.authMsg = '';
         if ($scope.resetForm.$valid) {

            var newpwd = new SetNewPwd();
            newpwd.password = $scope.recover.password;

            // $http
            //  .post('api/account/register', {email: $scope.account.email, password: $scope.account.password})
            newpwd.$save()
               .then(function(response) {
                  $scope.msgPass = 'Password Reset Successful. You are going to redirect login page..';
                  $scope.recover.password = "";
                  $scope.recover.password_confirm = "";
                  $cookieStore.put('resetpass', 'success');

                  $timeout(function() {
                     $window.location.href = '#/page/login';
                  }, 4000);

               }, function(x) {
                  $scope.authMsg = 'Password Reset Failed';
               });
            $scope.resetForm.password.$dirty = false;
         } else {
            $scope.resetForm.password.$dirty = true;
         }
      };
   }
]);
