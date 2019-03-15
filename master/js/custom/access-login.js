/**=========================================================
* Module: access-login.js
* Demo for login api
=========================================================*/

App.factory('AuthService', function($q, $cookieStore, Login) {
  var AuthService = {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
  };

  AuthService.login = function(credentials) {
    return new Login(credentials).$save().then(function(res) {
      // Session.create(res.token, res.user,'customeradmin');

      //res.role = "CUSTOMERADMIN";
      res.role = "ADMIN";


      return res;
    });
  };

  AuthService.isAuthenticated = function() {
    //return !!currentUser.token;
    var deferred = $q.defer();
    if (!!$cookieStore.get('currentUser')) {
      //if(currentUser.token!=null){
      deferred.resolve(AuthService.OK);
    } else {
      deferred.reject(AuthService.UNAUTHORIZED);
    }
    return deferred.promise;
  };

  AuthService.isAuthorized = function(authorizedRoles) {

    var deferred = $q.defer();
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    if (!!$cookieStore.get('currentUser')) {
      if (authorizedRoles.indexOf($cookieStore.get('currentUser').role) !==
        -1) {
        //if(authorizedRoles.indexOf(currentUser.role) !== -1){
        deferred.resolve(AuthService.OK);
      } else {
        deferred.reject(AuthService.FORBIDDEN);
      }
    } else {
      deferred.reject(AuthService.UNAUTHORIZED);
    }
    //return (AuthService.isAuthenticated() && authorizedRoles.indexOf(currentUser.role) !== -1); };
    return deferred.promise;
  }
  return AuthService;
});

App.factory('Login', function($resource, config, EnvironmentConfig, $rootScope) {
  //console.log(config.serverUrl);
  //var endpoint = "http://localhost\:8080/" + $rootScope.apiMCF + "auth/login/:id";
  var endpoint = EnvironmentConfig.serverUrl + config.apiMCF + "api/login";
  //  console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
  //console.log("endpoint: " + endpoint);

  return $resource(endpoint, {
    password: "@password",
    username: "@username"
  }, {
    query: {
      method: 'POST'
    }
  });

});

App.factory('$remember', function() {
  function fetchValue(name) {
    var gCookieVal = document.cookie.split("; ");
    for (var i = 0; i < gCookieVal.length; i++) {
      // a name/value pair (a crumb) is separated by an equal sign
      var gCrumb = gCookieVal[i].split("=");
      if (name === gCrumb[0]) {
        var value = '';
        try {
          value = angular.fromJson(gCrumb[1]);
        } catch (e) {
          value = unescape(gCrumb[1]);
        }
        return value;
      }
    }
    // a cookie with the requested name does not exist
    return null;
  }
  return function(name, values) {
    if (arguments.length === 1) return fetchValue(name);
    var cookie = name + '=';
    if (typeof values === 'object') {
      var expires = '';
      cookie += (typeof values.value === 'object') ? angular.toJson(
        values.value) + ';' : values.value + ';';
      if (values.expires) {
        var date = new Date();
        date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 *
          1000));
        expires = date.toGMTString();
      }
      cookie += (!values.session) ? 'expires=' + expires + ';' : '';
      cookie += (values.path) ? 'path=' + values.path + ';' : '';
      cookie += (values.secure) ? 'secure;' : '';
    } else {
      cookie += values + ';';
    }
    document.cookie = cookie;
  }
});


App.controller('LoginFormController', ['$scope', '$http', '$localStorage',
  '$state', '$remember', '$rootScope', '$timeout', 'Login', 'AuthService',
  'config',
  '$cookieStore',
  function($scope, $http, $localStorage, $state, $remember, $rootScope,
    $timeout,
    Login, AuthService, config, $cookieStore) {



    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.authMsg = '';
    $scope.remember = ($remember('remember')) ? true : false;
    if ($scope.remember) {

      $scope.account.username = $remember('username');
      $scope.account.password = $remember('password');

    }


    $scope.spinnerShow = false;
    $scope.login = function() {
      $scope.authMsg = '';
      $scope.spinnerShow = true;

      if ($scope.loginForm.$valid) {
        AuthService.login($scope.account).then(function(res) {
          //console.log("LOGIN CHECK")
          //console.log(res.roles)
          //console.log(res.username);
          //console.log(res.token_type);
          if (res.username) {
            $rootScope.$broadcast('loginSuccess');
            $cookieStore.put('currentUser', res);
            $cookieStore.put('setUsername', res.username);
            $cookieStore.put('setRoles', res.roles);
            currentUser = res;
            localStorage.setItem('token', JSON.stringify(res.token_type +
              ' ' + res.access_token));
            //console.log(res);
            if (currentUser.role == "ADMIN") {
              if (res.roles.indexOf("ROLE_SYSTEM_ADMIN") > -1 || res.roles.indexOf("ROLE_ADMIN") >
                -1 || res.roles.indexOf("ROLE_USER") > -1) {
                // $timeout(function(){
                $scope.spinnerShow = false;
                $state.go('app.uploadLargeFiles');
                //},2000);
              }

              if (res.roles.indexOf("ROLE_DRIVER") > -1) {
                $scope.spinnerShow = false;
                $state.go('app.customerdetails');
              }
            } else if (currentUser.role == "CUSTOMERADMIN") {
              $state.go('app.customeradmin');
            }
          } else {
            $rootScope.$broadcast('loginFailed');
            $cookieStore.remove('currentUser');
            $cookieStore.remove('setUsername');
            currentUser = {
              user: null,
              token: null,
              role: null
            };
            $scope.authMsg = 'User not found.';
          }
        }, function(reason) {
          //console.log(reason)
          // $scope.authMsg = 'User not found.';
          $scope.authMsg = 'Invalid UserName or Password';
          $rootScope.$broadcast('loginFailed');
          $scope.spinnerShow = false;
        });
      } else {
        // set as dirty if the user click directly to login so we show the validation messages
        $scope.loginForm.account_user.$dirty = true;
        $scope.loginForm.account_pwd.$dirty = true;
      }
    };


    // rememberMe validation
    $scope.remember = false;
    if ($remember('username') && $remember('password')) {
      $scope.remember = true;
      $scope.username = $remember('username');
      $scope.password = $remember('password');
    }
    $scope.rememberMe = function() {

      $remember('remember', $scope.remember);
      if ($scope.remember) {
        $remember('username', $scope.account.username);
        $remember('password', $scope.account.password);
      } else {
        $remember('username', '');
        $remember('password', '');
      }
    };


    /********* showing notification after password change , registration completed start ******/

    //angular.element(document).ready(function(){


    console.log('resetpass cookie==>' + $cookieStore.get('resetpass'));

    if ($cookieStore.get('resetpass') != undefined && $cookieStore.get(
        'resetpass') == 'success') {
      $scope.reset_register_success =
        'Your Password Reset Successfully. Login now';
      $cookieStore.remove('resetpass');
      console.log('reset_register_success==>' + $scope.reset_register_success);

    } else if ($cookieStore.get('registerform') != undefined &&
      $cookieStore.get('registerform') == 'success') {
      $scope.reset_register_success =
        'Your Registration completed Successfully. Please wait for admin approval to login';
      $cookieStore.remove('registerform');


    }


    //});
    /********* showing notification after password change , registration completed end ******/



  }
]);
