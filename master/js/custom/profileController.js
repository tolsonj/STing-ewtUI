App.factory('secUser', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "secuser";
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   console.log("endpoint: " + endpoint);
   console.log(localStorage.getItem('token'));
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
         url: $rootScope.serverUrl + 'MCF_backend/secuser',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/secuser/:id',
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
         url: $rootScope.serverUrl + 'MCF_backend/secuser/:id',
         params: {
            id: '@_id'
         }
      }
   });
});


App.controller('ProfileController', function($scope, $state, $timeout, $window,
   $cookieStore, $filter, ngTableParams, ngDialog, secUser, Flash) {

   $scope.userinfo = {
      username: "",
      password: ""
   };
   var userdata = $cookieStore.get('setUsername');
   $scope.onexistfail = true;
   $scope.failShowGet = false;
   $scope.uptsuccessShow = false;
   $scope.spinnerShow = true;

   $scope.getCurrentProfileInfo = function() {

      $scope.loggedUser = [];

      var getUSERDATA = secUser.query();

      getUSERDATA.$promise.then(function(getUSERDATA) {

         angular.forEach(getUSERDATA, function(value, key) {
            $scope.uname = value.username;
            if (userdata === $scope.uname) {
               // document.getElementById("welcome_name").innerHTML = "Welcome:  " +value.username+"-"+value.customerName+"-"+value.customerNumber;
               $cookieStore.put('setcustomerName', value.customerName);
               $cookieStore.put('setcustomerNumber', value.customerNumber);
               //console.log($scope.uname);
               console.log("key:" + key + " value:" + value);
               $scope.loggedUser.push(value);
               //console.log("GETDAT");
               console.log($scope.loggedUser);
               $scope.spinnerShow = false;
            }

            /*
				$timeout(function(){
					$scope.spinnerShow = false;
				},3000);
        */
         });


      });
   }

   $scope.getCurrentProfileInfo();



   // Edit dialog starts

   $scope.editDialog = function(editable) {

      $scope.onexistfail = true;
      var profile = this.$parent.profile;
      profile.isEditing = editable;


      profile.profileinfo = {};
      profile.profileinfo.username = profile.username;
      profile.profileinfo.password = profile.password;
      profile.profileinfo.confirm_password = profile.password;
      profile.profileinfo.email = profile.email;
      profile.profileinfo.firstname = profile.firstname;
      profile.profileinfo.lastname = profile.lastname;
      profile.profileinfo.phone = profile.phone;
      //profile.profileinfo.address =  profile.address;

      /*profile.admininfo.enabled =  profile.enabled;
      profile.admininfo.accountExpired = profile.accountExpired;
      profile.admininfo.accountLocked =  profile.accountLocked;
      profile.admininfo.passwordExpired =  profile.passwordExpired;*/

      // convert image into base64 format on changeRoles

      var handleFileSelect = function(evt) {
         var files = evt.target.files;
         var file = files[0];
         var filename = file.name;
         $scope.signImgExt = filename.split('.').pop();;

         console.log('file==>' + file.name);
         console.log('signImgExt==>' + $scope.signImgExt);

         if (files && file) {
            var reader = new FileReader();

            reader.onload = function(readerEvt) {
               var binaryString = readerEvt.target.result;

               $scope.userSign = btoa(binaryString);

               //console.log('binaryString==>'+btoa(binaryString));
               // document.getElementById("base64textarea").value = btoa(binaryString);
            };

            reader.readAsBinaryString(file);
         }
      };

      $timeout(function() {

         if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
         } else {
            alert('The File APIs are not fully supported in this browser.');
         }
      }, 1000);



   };



   $scope.saveDialog = function() {
      if (this.$parent.profile.userForm1.$valid && this.$parent.profile.userForm2
         .$valid && this.$parent.profile.userForm3.$valid && this.$parent.profile
         .userForm4.$valid && this.$parent.profile.userForm5.$valid && this.$parent
         .profile.userForm7.$valid && this.$parent.profile.userForm0.$valid) {
         var profile = this.$parent.profile;
         profile.isEditing = false;
         profile.profileinfo.isEditing = false;
         var index = $scope.loggedUser.indexOf(profile);
         var newsecUser = new secUser;
         newsecUser.username = profile.profileinfo.username;
         newsecUser.password = profile.profileinfo.password;
         newsecUser.email = profile.profileinfo.email;
         newsecUser.firstname = profile.profileinfo.firstname;
         newsecUser.lastname = profile.profileinfo.lastname;
         newsecUser.phone = profile.profileinfo.phone;
         newsecUser.address = profile.profileinfo.address;

         if ($scope.userSign != null && $scope.signImgExt != null) {
            newsecUser.userSign = $scope.userSign;
            newsecUser.ext = $scope.signImgExt;
         }
         /*profile.enabled =  profile.admininfo.enabled;
         profile.accountExpired =  profile.admininfo.accountExpired;
         profile.accountLocked =  profile.admininfo.accountLocked;
         profile.passwordExpired =  profile.admininfo.passwordExpired;*/
         angular.extend(profile, profile.profileinfo);
         newsecUser.$update({
            id: $scope.loggedUser[index].id
         }).then(function(response) {
            $cookieStore.put('setUsername', newsecUser.username);
            $scope.uptsuccessShow = true;

            $timeout(function() {
               $scope.uptsuccessShow = false;
               $scope.getCurrentProfileInfo();
            }, 5000);
         }, function(reason) {
            $scope.failShowGet = true;
            $timeout(function() {
               $scope.failShowGet = false;
            }, 5000);
         });

         /*
         $cookieStore.put('setUsername' ,profile.username);
         var profileUpdateInstance = new secUser;
         angular.extend(profileUpdateInstance, $scope.loggedUser[index]);
         profileUpdateInstance.$update({id:$scope.loggedUser[index].id});*/
      } else {
         this.$parent.profile.submitted = true;
      }

   };



});
