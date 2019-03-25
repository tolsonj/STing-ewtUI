/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http',
   '$timeout', '$cookies', '$cookieStore', 'Utils',
   function($rootScope, $scope, $state, $http, $timeout, $cookies,
      $cookieStore, Utils) {

      var userdata = $cookieStore.get('setRoles');
      var cookieRole = $cookieStore.get('currentUser');

      var collapseList = [];

      // demo: when switch from collapse to hover, close all items
      $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal) {
         if (newVal === false && oldVal === true) {
            closeAllBut(-1);
         }
      });

      // Check item and children active state
      var isActive = function(item) {

         if (!item) return;

         if (!item.sref || item.sref == '#') {
            var foundActive = false;
            angular.forEach(item.submenu, function(value, key) {
               if (isActive(value)) foundActive = true;
            });
            return foundActive;
         } else
            return $state.is(item.sref) || $state.includes(item.sref);
      };

      // Load menu from json file
      // -----------------------------------

      $scope.getMenuItemPropClasses = function(item) {
         return (item.heading ? 'nav-heading' : '') +
            (isActive(item) ? ' active' : '');
      };

      $scope.loadSidebarMenu = function() {

         var menuJson = 'server/sidebar-menu.json',
            menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
         $http.get(menuURL)
            .success(function(items) {



               //alert(cookieRole.role);
               //console.log("sidebar:"+cookieRole.role);
               //$scope.menuItems = items;
               var menuItemsCpy = [];
               for (var i = 0; i < items.length; i++) {

                  var obj = items[i];

                  for (var key in obj) {

                     if (key == "heading") {
                        menuItemsCpy.push(obj);
                     } else if (key == "sref") {
                        if (obj[key] == "app.uploadLargeFiles" || obj[key] == "app.dashboard") {
                           menuItemsCpy.push(obj);
                        }

                     }
                  }
               }
               $scope.menuItems = menuItemsCpy;
               // alert($scope.menuItems)
            })
            .error(function(data, status, headers, config) {
               alert('Failure loading menu');
            });
      };

      $scope.loadSidebarMenu();

      // Handle sidebar collapse items
      // -----------------------------------

      $scope.addCollapse = function($index, item) {
         collapseList[$index] = $rootScope.app.layout.asideHover ? true : !
            isActive(item);
      };

      $scope.isCollapse = function($index) {
         return (collapseList[$index]);
      };

      $scope.toggleCollapse = function($index, isParentItem) {


         // collapsed sidebar doesn't toggle drodopwn
         if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover)
            return true;

         // make sure the item index exists
         if (angular.isDefined(collapseList[$index])) {
            if (!$scope.lastEventFromChild) {
               collapseList[$index] = !collapseList[$index];
               closeAllBut($index);
            }
         } else if (isParentItem) {
            closeAllBut(-1);
         }

         $scope.lastEventFromChild = isChild($index);

         return true;

      };

      function closeAllBut(index) {
         index += '';
         for (var i in collapseList) {
            if (index < 0 || index.indexOf(i) < 0)
               collapseList[i] = true;
         }
      }

      function isChild($index) {
         return (typeof $index === 'string') && !($index.indexOf('-') < 0);
      }

   }
]);
