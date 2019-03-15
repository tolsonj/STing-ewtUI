App.factory('DataSourceFileFactory', function($resource) {
   return {
      query: function(dataSource) {
         /*
                          console.log('loading ' + dataSource);
                          if (dataSource == 'landfills') {
                             return $resource('server/landfills.json').query();
                          } else if (dataSource == 'drivers') {
                             return $resource('server/drivers.json').query();
                          } else if (dataSource == 'customers') {
                             return $resource('server/customers.json').query();
                          } else if (dataSource == 'sites') {
                             return $resource('server/sites.json').query();
                          } else if (dataSource == 'vehicles') {
                             return $resource('server/vehicles.json').query();
                          } else if (dataSource == 'containers') {
                             return $resource('server/containers.json').query();
                          } else if (dataSource == 'orders') {
                             return $resource('server/DispatchNewOrders.json').query();
                          } else if (dataSource == 'login') {
                             return $resource('server/login.json').query();
                          } */
      }
   }
});

App.factory('MockDatasourceFactoryService', function($resource, DataSourceFileFactory) {
   var service = {};

   var dataCustomer = DataSourceFileFactory.query('customers');
   var dataSite = DataSourceFileFactory.query('sites');
   var dataDriver = DataSourceFileFactory.query('drivers');
   var dataLandfill = DataSourceFileFactory.query('landfills');
   var dataVehicles = DataSourceFileFactory.query('vehicles');
   var dataContainers = DataSourceFileFactory.query('containers');
   var dataOrders = DataSourceFileFactory.query('orders');
   var dataLogin = DataSourceFileFactory.query('login');

   var data = [];
   var currentDataType = 'customers';


   service.setDataPointer = function(domain) {
      switch (domain) {
         case 'customers':
            data = dataCustomer;
            currentDataType = "customers";
            break;
         case 'sites':
            data = dataSite;
            currentDataType = "sites";
            break;
         case 'drivers':
            data = dataDriver;
            currentDataType = "drivers";
            break;
         case 'landfills':
            data = dataLandfill;
            currentDataType = "landfills";
            break;
         case 'vehicles':
            data = dataVehicles;
            currentDataType = "vehicles";
            break;
         case 'containers':
            data = dataContainers;
            currentDataType = "containers";
            break;
         case 'orders':
            data = dataOrders;
            currentDataType = "orders";
            break;
         case 'login':
            data = dataLogin;
            currentDataType = "login";
            break;
      }
   }


   // query
   service.getAllData = function(domain) {

      service.setDataPointer(domain);
      return data;
   }

   service.showAll = function(domain) {
      service.setDataPointer(domain);
      for (var i = 0; i < data.length; i++) {
         console.log(data[i].id);
      }
   }

   service.updateOne = function(id, dataItem, domain) {
      // find the game that matches that id

      // alert("update");
      var match = null;

      service.setDataPointer(domain);
      console.log("Looking for ID:" + id);
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == id) {
            console.log("Found ID:" + id + " in object data[" + i + "] with name:" + data[i].name);
            match = data[i];
            break;
         }
      }
      if (!angular.isObject(match)) {
         return {};
      }

      console.log("copying data sent to match and data[i]");
      angular.extend(match, dataItem);
      angular.extend(data[i], dataItem);
      return match;
   };


   // get
   service.findOne = function(id, domain) {
      service.setDataPointer(domain);
      // alert("findOne  "+id);
      // find the game that matches that id
      var list = $.grep(this.getAllData(), function(element, index) {
         return (element.id == id);
      });
      if (list.length === 0) {
         return {};
      }
      // even if list contains multiple items, just return first one
      return list[0];
   };

   service.deleteOne = function(id, domain) {
      service.setDataPointer(domain);
      var dataItems = data;
      var match = false;
      for (var i = 0; i < dataItems.length; i++) {
         if (dataItems[i].id == id) {
            match = true;
            dataItems.splice(i, 1);
            break;
         }
      }

      service.showAll()
      return match;
   };

   // Add a Object
   // add a new data item that does not exist already
   // must compute a new unique id and backfill in
   service.addOne = function(dataItem, domain) {


      service.setDataPointer(domain);
      // must calculate a unique ID to add the new data
      var newId = service.newId();
      console.log("MockDatasource addOne dataItem: " + dataItem);
      console.log("MockDatasource addOne domain: " + domain);

      dataItem.id = newId;
      data.push(dataItem);
      return dataItem;
   };

   // return an id to insert a new data item at
   service.newId = function() {

      //  alert("newId");
      // find all current ids
      var currentIds = $.map(data, function(dataItem) {
         return dataItem.id;
      });
      // since id is numeric, and we will treat like an autoincrement field, find max
      var maxId = Math.max.apply(Math, currentIds);
      // increment by one
      return maxId + 1;
   };
   return service;
});
