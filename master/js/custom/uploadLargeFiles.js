App.factory('UploadLargeFiles', function($resource, $rootScope) {

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

App.controller('uploadLargeFilesController', function($scope, $timeout, $cookieStore,
   $state, $window, $filter, ngTableParams, ngDialog, secUser, secRole,
   UserAdmin, Invite, Company, Customer, Flash, UploadLargeFiles) {

   $scope.options = [];



   var maxBlockSize = 100 * 1024;
   var currentFilePointer = 0;
   var totalBytesRemaining = 0;
   var blockIdIndex = 0;
   var blockId = "";
   $scope.percentComplete = 0;



   $scope.fileNameChanged = function(ele) {
      //console.log("select file");
      var files = ele.files;
      var l = files.length;
      var namesArr = [];

      $scope.selectedFile = files[0];


      maxBlockSize = 100 * 1024;
      currentFilePointer = 0;
      totalBytesRemaining = 0;
      blockIdIndex = 0;
      blockId = "";
      $scope.percentComplete = 0;


      //console.log("filename: " + $scope.selectedFile.name);
      //console.log("file size: " + $scope.selectedFile.size);
      //console.log("file type: " + $scope.selectedFile.type);



      var fileSize = $scope.selectedFile.size;
      if (fileSize < maxBlockSize) {
         maxBlockSize = fileSize;
         //console.log("max block size = " + maxBlockSize);
      }
      totalBytesRemaining = fileSize;
      if (fileSize % maxBlockSize == 0) {
         numberOfBlocks = fileSize / maxBlockSize;
      } else {
         numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
      }
      //console.log("total blocks = " + numberOfBlocks);

      var fileContent = $scope.selectedFile.slice(0, $scope.selectedFile.size);

      $scope.reader = new FileReader();



      // $scope.reader.readAsArrayBuffer(fileContent);


      $scope.reader.onloadend = function(evt) {
         if (evt.target.readyState === FileReader.DONE && !$scope.selectedFile.cancelled) { // DONE === 2
            var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(evt.target.result)));

            console.log(base64String);


            var uploadFile = new UploadLargeFiles();
            uploadFile.testing = "Hello - onloaded";

            var numBlockIdIndex = blockIdIndex.toString();
            uploadFile.blockId = $scope.selectedFile.name + "-BLOCK-" + numBlockIdIndex.padStart(7, '0');
            uploadFile.filename = $scope.selectedFile.name;
            uploadFile.data = base64String;
            uploadFile.$uploadData(function(resp, headers) {
               $scope.percentComplete = ((parseFloat($scope.selectedFile.size - totalBytesRemaining) / parseFloat($scope.selectedFile.size)) * 100).toFixed(2);
            });;


            //console.log(base64String)
         }
         uploadFileInBlocks();
      };


      uploadFileInBlocks();
      $scope.$apply();

   };

   var uploadFileInBlocks = function() {
      if (totalBytesRemaining > 0) {

         var fileContent = $scope.selectedFile.slice(currentFilePointer, currentFilePointer + maxBlockSize);

         var numBlockIdIndex = blockIdIndex.toString();
         blockId = $scope.selectedFile.name + "-BLOCK-" + numBlockIdIndex.padStart(7, '0');

         $scope.reader.readAsArrayBuffer(fileContent);

         currentFilePointer += maxBlockSize;
         totalBytesRemaining -= maxBlockSize;
         blockIdIndex += 1;

         if (totalBytesRemaining < maxBlockSize) {
            maxBlockSize = totalBytesRemaining;
         }
      } else {
         commitBlockList();
      }
   };

   commitBlockList = function() {
      var base64String = btoa($scope.selectedFile);
      // console.log(base64String);

      var uploadFile = new UploadLargeFiles();
      // uploadFile.testing = "Hello commitBlockList";

      var numBlockIdIndex = blockIdIndex.toString()
      uploadFile.blockId = $scope.selectedFile.name + "-BLOCK-" + numBlockIdIndex.padStart(7, '0');
      uploadFile.filename = $scope.selectedFile.name;
      uploadFile.data = base64String;
      uploadFile.$uploadData(function(resp, headers) {
         $scope.percentComplete = ((parseFloat($scope.selectedFile.size - totalBytesRemaining) / parseFloat($scope.selectedFile.size)) * 100).toFixed(2);
      }).then(function(resp, headers) {
         uploadFile.blockId = $scope.selectedFile.name + ".complete";
         blockIdIndex = 0
         uploadFile.data = btoa("COMPLETE");
         uploadFile.filename = $scope.selectedFile.name + ".complete";
         uploadFile.$uploadData();
      });


   };
   $scope.shouldShow = function(permissionLevel) {
      return ($scope.roles.indexOf("ROLE_SYSTEM_ADMIN") !== -1) ? true : permissionLevel.authority !=
         'ROLE_SYSTEM_ADMIN';
   };
   //Role filter for drop box (restricted for roles) ends

   angular.element(document).ready(function() {

   });

});
