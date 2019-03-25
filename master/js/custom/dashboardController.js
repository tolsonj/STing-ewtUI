App.factory('Dashboard', function($resource, $rootScope) {

   // var endpoint = "http://127.0.0.1\:8080/" + $rootScope.apiMCF + "secUser";
   var endpoint = $rootScope.serverUrl + $rootScope.apiMCF + "useradmin";
   //console.log("$rootScope.apiMCF: [" + $rootScope.apiMCF + "]");
   //console.log("endpoint: " + endpoint);

   return $resource(endpoint, {}, {

      query: {
         method: 'GET',
         isArray: true,
         headers: {
            'Content-Type': 'undefined',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: 'http://10.1.1.63:8080/STingWebService/service/stingResult/getAll',
         params: {}
      },
      uploadData: {
         method: 'POST',
         headers: {
            'Content-Type': 'undefined',
            'Authorization': JSON.parse(localStorage.getItem('token'))
         },
         url: $rootScope.serverUrl + 'mcfApi/uploadData',
         params: {}
      }

   });
});

App.controller('dashboardController', function($scope, $timeout, $cookieStore,
   $state, $window, $filter, ngTableParams, ngDialog, secUser, secRole,
   UserAdmin, Invite, Company, Customer, Flash, UploadLargeFiles) {

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
   /*
      var dashboard = new Dashboard();
      var stingRecord1 = dashboard.$query().then(function() {
         alert("ASDFASDF");
      })
   */

   var stingRecords = [{
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }, {
      "id": 855,
      "name": "archymedes.sql",
      "startTime": 1553477773000,
      "endTime": 1553477773000,
      "status": "Completed",
      "lineType": "allelic_profile",
      "st": 0,
      "abcZ": 0,
      "adk": 0,
      "aroE": 0,
      "fumC": 0,
      "gdh": 0,
      "pdhC": 0,
      "pgm": 0,
      "totalKmers": 0,
      "totalReads": 0
   }];

   $scope.bol_list_table = angular.fromJson(stingRecords);
   $scope.totalItems = $scope.bol_list_table.length;
   var maxBlockSize = 100 * 1024;
   var currentFilePointer = 0;
   var totalBytesRemaining = 0;
   var blockIdIndex = 0;
   var blockId = "";
   $scope.percentComplete = 0;

   $scope.itemsPerPage = 10;
   $scope.currentPage = 1;

   $scope.pageChanged = function(item) {
      $scope.updatePaging();
      console.log('currentPage==>' + $scope.currentPage);
   };
   $scope.updatePaging = function() {
      if ($scope.currentPage == 1) {
         $scope.offset_val = 0;

      } else {
         $scope.offset_val = ($scope.currentPage - 1) * 20;
      }
   };



   angular.element(document).ready(function() {

   });

});
