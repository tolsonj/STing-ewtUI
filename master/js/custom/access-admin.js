App.factory('secRole', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "secrole";
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
      },
      save: {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/secrole',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/secrole/:id',
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
         url: $rootScope.serverUrl + 'MCF_backend/secrole/:id',
         params: {
            id: '@_id'
         }
      }
   });
});


App.factory('Invite', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "invite";
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   //console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
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
         url: $rootScope.serverUrl + 'MCF_backend/invite',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/invite/:id',
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
         url: $rootScope.serverUrl + 'MCF_backend/invite/:id',
         params: {
            id: '@_id'
         }
      }

   });
});

App.factory('UserAdmin', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "useradmin";
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   //console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
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
         url: $rootScope.serverUrl + 'MCF_backend/useradmin',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/useradmin/:id',
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
         url: $rootScope.serverUrl + 'MCF_backend/useradmin/:id',
         params: {
            id: '@_id'
         }
      }

   });
});

App.factory('Customer', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "customer";
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
         isArray: true,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         }
      },
      AssignmentQuery: {
         method: 'GET',
         isArray: true,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/assignment?thisWeek=true',
      },

      checkCustomerEmail: {
         method: 'GET',
         isArray: false,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/customer?customerNumber=:custNo',
         params: {
            custNo: '@_custNo'
         }
      },
      save: {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/customer',
         params: {}
      },
      update: {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'MCF_backend/customer/:id',
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
         url: $rootScope.serverUrl + 'MCF_backend/customer/:id',
         params: {
            id: '@_id'
         }
      }

   });
});
App.controller('AdminController', function($scope, $timeout, $cookieStore,
   $state, $window, $filter, ngTableParams, ngDialog, secUser, secRole,
   UserAdmin, Invite, Company, Customer, Flash) {

   $scope.options = [];
   /*
   $scope.options = [
      "France",
      "United Kingdom",
      "Germany",
      "Belgium",
      "Netherlands",
      "Spain",
      "Italy",
      "Poland",
      "Austria"
   ]

*/
   $scope.selectionx = [];
   $scope.titleEnabled = true;
   $scope.existfail = false;
   $scope.onexistfail = true;
   $scope.titleEnabled1 = true;
   $scope.userinfo = {
      email: "",
      password: ""
   };
   $scope.chkname = $cookieStore.get('setUsername');
   $scope.roles = $cookieStore.get('setRoles');
   $scope.authMsg = '';
   $scope.invite = Invite.query();



   $scope.successShow = false;
   $scope.uptsuccessShow = false;
   $scope.failShowGet = false;
   $scope.externalkey_err = false;
   $scope.onLoadspinnerShow = true;

   $scope.showHiddenFields = true;
   $timeout(function() {
      $scope.showHiddenFields = false;
   }, 270);

   $scope.secRole = secRole.query(function(res) {
      console.log("secRole");
      // console.log(res);

   }, function(error) {
      $scope.failShowGet = true;
      //$timeout(function() { $scope.failShowGet = false;}, 5000);
   });

   $scope.customer = Customer.query(function(res) {
      console.log("Customer");
      //console.log(res);

   }, function(error) {
      $scope.failShowGet = true;
      //$timeout(function() { $scope.failShowGet = false;}, 5000);
   });


   var secRole_info = $scope.secRole;
   secRole_info.$promise.then(function(secRole_info) {
      $scope.adduser.selectedRole = secRole_info[0];
      $scope.options = [];
      secRole_info.forEach(function(obj) {
         if ($scope.roles.indexOf("ROLE_SYSTEM_ADMIN") !== -1) { // if ROLE_SYSTEM_ADMIN == TRUE
            $scope.options.push(obj.authority);
         } else if (obj.authority !== "ROLE_SYSTEM_ADMIN") {
            $scope.options.push(obj.authority);
         }

      });


   });
   //Role filter for drop box (restricted for roles)
   $scope.shouldShow = function(permissionLevel) {
         return ($scope.roles.indexOf("ROLE_SYSTEM_ADMIN") !== -1) ? true : permissionLevel.authority !=
            'ROLE_SYSTEM_ADMIN';
      }
      //Role filter for drop box (restricted for roles) ends

   $scope.company = Company.query();
   var company_info = $scope.company;
   company_info.$promise.then(function(company_info) {
      $scope.company_id = company_info.id;
      //console.log($scope.company_id);
   });


   $scope.adduser = {
      id: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      customerNumber: "",
      enabled: false,
      accountExpired: false,
      accountLocked: false,
      passwordExpired: false
   };


   $scope.invitor = {
      email: ""
   }


   $scope.model = {
      code: "",
      radmin: "",
      ruser: ""
   };
   //$scope.model.code = "";
   //$scope.geterrchk = UserAdmin.query(function(res) {

   //}, function(error) {
   //   $scope.failShowGet = true;
   //});


   var data;
   if ($scope.roles.indexOf("ROLE_SYSTEM_ADMIN") !== -1) {
      data = UserAdmin.query({
         roleFilter: "false"
      });
   } else {
      data = UserAdmin.query({
         roleFilter: "true"
      });
   }


   // var data = UserAdmin.query({roleFilter : "false"});
   data.$promise.then(function(data) {
      console.log("data to angular json::" + angular.toJson(data));
      $scope.tableParams = new ngTableParams({
         page: 1, // show first page
         count: 10, // count per page
         filter: {
            // status:'H'       // initial filter
         }
      }, {
         total: data.length, // length of data
         getData: function($defer, params) {
            // use build-in angular filter
            $scope.adminData = params.filter() ? $filter('filter')(
               data, params.filter()) : data;
            $defer.resolve($scope.adminData.slice((params.page() - 1) *
               params.count(), params.page() * params.count()));
            params.total($scope.adminData.length); // set total for recalc pagination
            $scope.onLoadspinnerShow = false;


         }
      });
   });



   var data_reload;
   $scope.reloadDispatchAdmin = function() {
      if ($scope.roles == "ROLE_SYSTEM_ADMIN") {
         data_reload = UserAdmin.query({
            roleFilter: "false"
         });
      } else {
         data_reload = UserAdmin.query({
            roleFilter: "true"
         });
      }

      // data_reload = UserAdmin.query();
      data_reload.$promise.then(function(data_new) {
         angular.extend(data, data_new);
         console.log("data to angular json:" + angular.toJson(data_new));
         //console.log("data length::"+data.length);
         $scope.tableParams.total(data.length);
         $scope.tableParams.reload();
      });
   }



   $scope.roleUser = [];
   // var filterUser = UserAdmin.query();


   //console.log(filterUser);
   /*
   if ($scope.roles == 'ROLE_USER') {
      filterUser.$promise.then(function(filterUser) {
         angular.forEach(filterUser, function(value, key) {
            if (value.Authority[0] == "undefined") {
               $scope.uname = value.Authority[0];
               //console.log("ForEach");
               //console.log(value.Authority[0].authority);
               if ($scope.roles == $scope.uname) {
                  $scope.roleUser.push(value);
                  //console.log($scope.roleUser);
               }
            }

         });


      });
   }
   */

   /*
      if ($scope.roles == 'ROLE_ADMIN' || $scope.roles == 'ROLE_SYSTEM_ADMIN') {
         filterUser.$promise.then(function(filterUser) {
            angular.forEach(filterUser, function(value, key) {
               if (value.Authority[0] == "undefined") {
                  $scope.uname = value.Authority[0].authority;
                  //console.log("ForEach");
                  //console.log(value.Authority[0].authority);
                  if ($scope.roles == $scope.uname) {
                     $scope.roleUser.push(value);
                     //console.log($scope.roleUser);
                  }
               }

            });


         });
      }
   */


   // To delete the entire row
   $scope.deleteDialog = function(username) {
      $scope.getUsername = username;
      var row = this.$parent.admin;
      ngDialog.openConfirm({
         template: 'deleteDialogId',
         className: 'ngdialog-theme-default',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function(value) {
         var index = data.indexOf(row);
         var adminDelete = new UserAdmin;
         angular.extend(adminDelete, data[index]);
         adminDelete.$destroy({
            id: data[index].id
         }).then(function(response) {
            data.splice(index, 1);
            $scope.tableParams.reload();
         }, function(reason) {
            $scope.failShowGet = true;
            $timeout(function() {
               $scope.failShowGet = false;
            }, 5000);
         });

         // need a call to delete to the backend
      }, function(reason) {
         //console.log('Cancel');
      });
   };


   /* Get data index value from array object value ends starts */
   function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
      if (valuetosearch) {
         for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
               return i;
            }
         }
      }
      return null;
   }

   function findindex(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
         if (arraytosearch[i][key] == valuetosearch) {
            return i;
         }
      }
      return null;
   }
   /* Get data (array object) index value from array object value ends*/

   /*Selecet multiple rows one by one and delete code starts*/

   $scope.multiple_del = [];
   $scope.getcheckboxId = function(selected_data, getcheckval) {
      $scope.checkbox_val = selected_data;
      if (getcheckval == true) {
         $scope.multiple_del.push($scope.checkbox_val);
      }
      if (getcheckval == false) {
         var index = findindex($scope.multiple_del, "id", selected_data.id);
         $scope.multiple_del.splice(index, 1);
      }
      //console.log($scope.multiple_del);
   };

   $scope.deleteSelectedRows = function() {
      for (var i = $scope.multiple_del.length - 1; i >= 0; i--) {
         var dataId = $scope.multiple_del[i].id;
         var index = functiontofindIndexByKeyValue(data, "id", dataId);
         //alert(index);
         var adminDeleteInstance = new UserAdmin;
         angular.extend(adminDeleteInstance, $scope.multiple_del[i]);
         adminDeleteInstance.$destroy({
            id: dataId
         }).then(function(response) {
            //   console.log(response);
         }, function(error) {
            $scope.failShowGet = true;
            $timeout(function() {
               $scope.failShowGet = false;
            }, 5000);
         });
         data.splice(index, 1);
         $scope.tableParams.reload();
      }
      $scope.multiple_del = [];
      $scope.checkboxes = {
         'checked': false,
         items: {}
      };
   };
   /*Selecet multiple rows one by one and delete code starts*/

   /*Selecet all rows and delete code starts*/

   $scope.checkboxes = {
      'checked': false,
      items: {}
   };
   // watch for check all checkbox
   $scope.$watch('checkboxes.checked', function(value) {
      $scope.multiple_del = [];
      angular.forEach($scope.adminData, function(item) {
         //console.log("item");console.log(item);
         if (item.username != $scope.chkname) {
            // $scope.checkboxes.checked = false;
            $scope.multiple_del.push(item);
         }
         console.log($scope.multiple_del);
         if (angular.isDefined(item.id)) {
            $scope.checkboxes.items[item.id] = value;

         }

      });
   });

   // watch for data checkboxes
   $scope.$watch('checkboxes.items', function(values) {

      if (!$scope.users) {
         return;
      }
      var checked = 0,
         unchecked = 0,
         total = $scope.users.length;
      angular.forEach($scope.users, function(item) {
         checked += ($scope.checkboxes.items[item.id]) || 0;
         unchecked += (!$scope.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
         $scope.checkboxes.checked = (checked == total);
      }

      // grayed checkbox
      angular.element(document.getElementById("select_all")).prop(
         "indeterminate", (checked != 0 && unchecked != 0));
      $scope.deleteSelectedRows();
   }, true);

   /*Selecet all rows and delete code ends*/

   $scope.saveuname;
   // Edit dialog starts

   $scope.findIndexByKeyValue = function(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
         if (valuetosearch) {
            if (arraytosearch[i][key] == valuetosearch) {
               return i;
            }
         }
      }

      return null;
   }



   $scope.editDialog = function(editable) {
      admin = this.$parent.admin;
      admin.isEditing = editable;
      var index = data.indexOf(admin);

      admin.admininfo = {};
      admin.admininfo.username = admin.username;
      admin.admininfo.password = admin.password;
      admin.admininfo.email = admin.email;
      admin.admininfo.phone = admin.phone;
      //admin.admininfo.address = admin.address;
      admin.admininfo.customerNumber = admin.customerNumber;
      admin.admininfo.customerName = admin.customerName;

      // find index by attribute value in secRole array
      /*

	var role_index = $scope.secRole.map( (el) => el.authority ).indexOf(admin.Authority[0].authority);

	above code cause error in ios safari browser


    */


      var role_index = 0;
      if (admin.Authority[0] != undefined)
         role_index = $scope.findIndexByKeyValue($scope.secRole, 'authority', admin.Authority[0].authority);

      console.log('role_index==>' + role_index);


      admin.admininfo.ruser = $scope.secRole[role_index];

      admin.admininfo.enabled = admin.enabled;
      admin.admininfo.accountExpired = admin.accountExpired;
      admin.admininfo.accountLocked = admin.accountLocked;
      admin.admininfo.passwordExpired = admin.passwordExpired;
      $scope.onexistfail = true;
      $scope.saveuname = admin.username;
      $timeout(function() {
         if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker2').addEventListener('change', handleFileSelect,
               false);
         } else {
            alert('The File APIs are not fully supported in this browser.');
         }
      }, 2000);

   };

   $scope.saveDialog = function() {
      var value1, value2, value3;
      if (this.$parent.admin.userForm.$valid) {
         var saveadmin = this.$parent.admin;
         saveadmin.isEditing = false;
         var index = data.indexOf(saveadmin);
         var useradmin = new UserAdmin();
         useradmin.Authority = [];
         useradmin.id = data[index].id; //  saveadmin.admininfo.id;
         useradmin.username = saveadmin.admininfo.username;
         useradmin.password = saveadmin.admininfo.password;
         useradmin.email = saveadmin.admininfo.email;
         useradmin.phone = saveadmin.admininfo.phone;
         useradmin.address = saveadmin.admininfo.address;
         useradmin.customerNumber = saveadmin.admininfo.customerNumber;
         useradmin.customerName = saveadmin.admininfo.customerName;
         useradmin.enabled = saveadmin.admininfo.enabled;
         useradmin.accountExpired = saveadmin.admininfo.accountExpired;
         useradmin.accountLocked = saveadmin.admininfo.accountLocked;
         useradmin.passwordExpired = saveadmin.admininfo.passwordExpired;

         if ($scope.userSign != null && $scope.signImgExt != null) {
            useradmin.userSign = $scope.userSign;
            useradmin.ext = $scope.signImgExt;
         }

         //alert(data[index].id);
         // lert(saveadmin.admininfo.selectionx);
         angular.copy(saveadmin.admininfo.selectionx, useradmin.Authority);

         /*
                  var obj = {};
                  if ($scope.userRoleId == undefined && $scope.userRole == undefined) {
                     $.each(saveadmin.Authority, function() {
                        var key = Object.keys(this)[0];
                        var key1 = Object.keys(this)[1];
                        var key2 = Object.keys(this)[2];
                        value1 = this[key];
                        value2 = this[key1];
                        value3 = this[key2];

                     });

                     //	if(saveadmin.admininfo.radmin == true){ value2 =2; value3="ROLE_ADMIN";  }
                     //	if(saveadmin.admininfo.ruser == true){  value2 =1; value3="ROLE_USER";  }
                     var key1 = "class";
                     var key2 = "id";
                     var key3 = "authority";

                     obj[key1] = value1;
                     obj[key2] = value2;
                     obj[key3] = value3;
                     useradmin.Authority.push(obj);
                  }
                  //  console.log(saveadmin.admininfo);
                  else {
                     obj['id'] = $scope.userRoleId;
                     obj['authority'] = $scope.userRole;
                     useradmin.Authority.push(obj);
                  }
         */

         console.log("currentUserId:" + data[index].id)
         console.log(angular.toJson(useradmin));

         useradmin.$update({
            id: data[index].id
         }).then(function(response) {
            if ($scope.chkname == $scope.saveuname) {
               $cookieStore.put('setUsername', useradmin.username);
               $scope.chkname = $cookieStore.get('setUsername');
            }
            angular.extend(data[index], response);
            angular.copy(response.Authority, useradmin.Authority);

            $scope.reloadDispatchAdmin();
            $scope.uptsuccessShow = true;

            $scope.uptsuccessShow = false;
            $scope.tableParams.reload();
            $window.location.reload();

         }, function(reason) {
            //Property [externalKey] of class [class com.wds.MCF.security.rest.SecUser] with value [103] must be unique
            //console.log(angular.toJson(reason.data.errors[0].message));

            if (reason.data.errors[0].message ==
               "Property [customerNumber] of class [class com.wds.MCF.security.rest.SecUser] with value [" +
               useradmin.customerNumber + "] must be unique") {
               //console.log(useradmin.externalKey);
               $scope.externalkey_err = true;
               $timeout(function() {
                  $scope.externalkey_err = false;
               }, 5000);
            }

            if (reason.data.Error) {
               //console.log(angular.toJson(reason.data.Error));
               $scope.onexistfail = false;
               $timeout(function() {
                  $scope.onexistfail = true;
               }, 5000);
            } else {
               $scope.failShowGet = true;
               $timeout(function() {
                  $scope.failShowGet = false;
               }, 5000);
            }
         });
         $scope.tableParams.reload();
         //});
      } else {
         this.$parent.admin.submitted = true;
      }
   };

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

   if (window.File && window.FileReader && window.FileList && window.Blob) {
      document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
   } else {
      alert('The File APIs are not fully supported in this browser.');
   }


   $scope.addDialog = function() {
      //alert("add" +  $scope.getRoleID  + $scope.getRoles);

      console.log('adminform addDialog');
      if ($scope.adminForm.$valid) {
         var uroles, aroles, urole_id, arole_id;

         var newUserAdmin = new UserAdmin();
         newUserAdmin.Authority = [];
         newUserAdmin.username = $scope.adduser.username;
         newUserAdmin.password = $scope.adduser.password;
         newUserAdmin.email = $scope.adduser.email;
         newUserAdmin.phone = $scope.adduser.phone;
         //newUserAdmin.address = $scope.adduser.address;
         newUserAdmin.customerNumber = $scope.adduser.customerNumber;
         newUserAdmin.customerName = $scope.adduser.customerName;
         //alert($scope.adduser.customerNumber);
         newUserAdmin.companyId = $scope.company_id;
         newUserAdmin.enabled = $scope.adduser.enabled;
         newUserAdmin.accountExpired = $scope.adduser.accountExpired;
         newUserAdmin.accountLocked = $scope.adduser.accountLocked;
         newUserAdmin.passwordExpired = $scope.adduser.passwordExpired;

         if ($scope.userSign != null && $scope.signImgExt != null) {
            newUserAdmin.userSign = $scope.userSign;
            newUserAdmin.ext = $scope.signImgExt;
         }



         var userdata = {};

         //console.log(newUserAdmin.Authority[0]);
         if ($scope.getRoleID == undefined && $scope.getRoles == undefined) {
            userdata['id'] = 1;
            userdata['authority'] = "ROLE_USER";
            newUserAdmin.Authority.push(userdata);
         } else {
            //alert("else");
            userdata['id'] = $scope.getRoleID;
            userdata['authority'] = $scope.getRoles;
            newUserAdmin.Authority.push(userdata);
         }



         newUserAdmin.$save().then(function(response) {
            console.log("Response:" + angular.toJson(response));
            $scope.successShow = true;

            $scope.adduser.username = "";
            $scope.adduser.password = "";
            $scope.adduser.phone = "";
            $scope.adduser.email = "";
            $scope.adduser.customerName = "";
            $scope.adduser.customerNumber = "";
            $scope.adduser.enabled = true;
            $scope.adduser.accountExpired = false;
            $scope.adduser.accountLocked = false;
            $scope.adduser.passwordExpired = false;
            $scope.adduser.roleuser = false;
            $scope.adduser.roleadmin = false;
            $scope.tableParams.reload();
            $timeout(function() {
               $scope.successShow = false;
            }, 5000);
            data.push(response);
            $scope.tableParams.reload();
            $scope.reload_dispatch();
         }, function(reason) {
            //alert("error");
            if (reason.data.errors) {
               //console.log(angular.toJson(reason.data.Error));
               $scope.existfail = true;
               $timeout(function() {
                  $scope.existfail = false;
                  $scope.adduser.username = "";
                  $scope.adduser.password = "";
               }, 5000);
            } else {
               $scope.failShowGet = true;
               $timeout(function() {
                  $scope.failShowGet = false;
               }, 5000);
            }
         });



         $scope.adminForm.name.$dirty = false;
         $scope.adminForm.pwd.$dirty = false;
         $scope.adminForm.email.$dirty = false;
         $scope.adminForm.phone.$dirty = false;
         // $scope.adminForm.address.$dirty = false;
         $scope.adminForm.customerNumber.$dirty = false;
         $scope.adminForm.customerName.$dirty = false;

         $scope.titleEnabled = true;



      } else {
         $scope.adminForm.name.$dirty = true;
         $scope.adminForm.pwd.$dirty = true;
         $scope.adminForm.email.$dirty = true;
         $scope.adminForm.phone.$dirty = true;
         // $scope.adminForm.address.$dirty = true;
         $scope.adminForm.customerNumber.$dirty = true;
      }
   };

   $scope.changeRoles = function(getRoles) {
         //alert(getRoles.authority);
         $scope.getRoleID = getRoles.id;
         $scope.getRoles = getRoles.authority;
         /* $scope.adduser.roleadmin =false;
          $scope.titleEnabled = true;*/
      }
      /*$scope.changeadmin = function(s)
       {
      	 $scope.adduser.roleuser =false;
      	 $scope.titleEnabled = true;
       }*/
   $scope.userEdit = function(usrrole) {
         // alert(usrrole.id + usrrole.authority);
         $scope.userRoleId = usrrole.id;
         $scope.userRole = usrrole.authority;
         /* if($scope.model.radmin == "") { $scope.model.radmin = true; }
          $timeout(function(){$scope.model.radmin = false; },500);*/
      }
      /*$scope.adminEdit = function(admrole)
       {
      	  if($scope.model.ruser == "") { $scope.model.ruser = true;  }
      	  $timeout(function(){ $scope.model.ruser = false; },500);
       }*/

   $scope.getselectval = function(item, type) {
      console.log("item");
      console.log(item);

      switch (type) {
         case 'add':
            $scope.adduser.customerName = item.name;
            $scope.adduser.customerNumber = item.customerNumber;
            break;
         case 'edit':
            admin.admininfo.customerName = item.name;
            admin.admininfo.customerNumber = item.customerNumber;
            break;
         case 'invite':
            $scope.custName = item.name;
            $scope.custId = item.customerNumber;
            break;
      }

   }

   $scope.getuseRole = function(role) {
      $scope.inviterole = role.authority;
   }
   $scope.inviteSpinnerShow = false;
   $scope.inviteDialog = function() {
      ngDialog.openConfirm({
         template: 'inviteDialogId',
         className: 'ngdialog-theme-default',
         preCloseCallback: 'preCloseCallbackOnScope',
         scope: $scope
      }).then(function() {

         //alert($scope.custName + $scope.custId);
         var newInvite = new Invite();
         newInvite.email = $scope.invitor.email;
         newInvite.customer_name = $scope.custName;
         //  newInvite.external_company_id = $scope.custId;
         newInvite.customer_number = $scope.custId;
         newInvite.role = "ROLE_USER";
         /* if($scope.inviterole == undefined || $scope.inviterole == ""){
              newInvite.role  =   "ROLE_USER";
          }
          else {
              newInvite.role  =   $scope.inviterole;
          }*/
         //alert($scope.inviterole);
         console.log('invitor email addresses==>' + $scope.invitor.email);
         $scope.inviteSpinnerShow = true;
         newInvite.$save().then(function(response) {
            //console.log("USER INVITE");

            console.log(response.result);

            angular.forEach(response.result, function(val, index) {
               $scope.authMsg += val.email + ' ' + val.message;

            });



            //$scope.authMsg = response.message;
            $scope.inviteSpinnerShow = false;

            $timeout(function() {
               $scope.authMsg = '';
               $scope.invitor.email = '';

            }, 5000);

         });

      }, function(reason) {
         console.log('Modal promise rejected. Reason: ', reason);
         if (reason == "button") { // do nothing
         } else if (reason == "$closeButton") {
            // do nothing
         } else {
            $scope.failShowGet = true;
            $timeout(function() {
               $scope.failShowGet = false;
            }, 5000);
         }

      });
   };

   angular.element(document).ready(function() {

   });

});
