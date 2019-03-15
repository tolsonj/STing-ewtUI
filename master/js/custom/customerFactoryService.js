App.factory('customerFactory', function() {
    var service = {};
    var data = [
    {
      "id": 1,
      "state": "GA",
      "phone": "333-333-33333",
      "federalTaxId": "234-222222",
      "street": "322 Main St",
      "secondaryStreet": "322 Main St",
      "fax": "444-444-44444",
      "notes": "note1",
      "city": "Atlanta",
      "postalCode": "33333",
      "website": "wds.com",
      "class": "com.wds.MCF.Customer",
      "name": "Mockit Design Studio"
    },
    {
      "id": 99,
      "state": "GA",
      "phone": "333-333-33333",
      "federalTaxId": "234-222222",
      "street": "322 Main St",
      "secondaryStreet": "322 Main St",
      "fax": "444-444-44444",
      "notes": "note1",
      "city": "Atlanta",
      "postalCode": "33333",
      "website": "wds.com",
      "class": "com.wds.MCF.Customer",
      "name": "Jack The Man Studio"
    },
    {
      "id": 100,
      "state": "GA",
      "phone": "333-333-33333",
      "federalTaxId": "234-222222",
      "street": "322 Main St",
      "secondaryStreet": "322 Main St",
      "fax": "444-444-44444",
      "notes": "note1",
      "city": "Atlanta",
      "postalCode": "33333",
      "website": "wds.com",
      "class": "com.wds.MCF.Customer",
      "name": "100 Design Studio"
    }];

    // query
    service.getAllData = function() {
      return data;
    }

    service.showAll = function() {
      for (var i=0; i < data.length; i++) {
        console.log(data[i].name + ":" + data[i].id);
      }
    }

    service.updateOne = function(id, dataItem) {
          // find the game that matches that id
          var match = null;

          for (var i=0; i < data.length; i++) {
              if(data[i].id == id) {
                  match = data[i];
                  break;
              }
          }
          if(!angular.isObject(match)) {
              return {};
          }

          angular.extend(match, dataItem);
          angular.extend(data[i], dataItem);
          return match;
      };


    // get
    service.findOne = function(id) {
         // alert(id);
         // find the game that matches that id
         var list = $.grep(this.getAllData(), function(element, index) {
             return (element.id == id);
         });
         if(list.length === 0) {
             return {};
         }
         // even if list contains multiple items, just return first one
         return list[0];
     };

     service.deleteOne = function(id) {
         var dataItems = data;
         var match = false;
         for (var i=0; i < dataItems.length; i++) {
             if(dataItems[i].id == id) {
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
       service.addOne = function(dataItem) {
           // must calculate a unique ID to add the new data
           var newId = service.newId();
           dataItem.id = newId;
           data.push(dataItem);
           return dataItem;
       };

       // return an id to insert a new data item at
       service.newId = function() {
           // find all current ids
           var currentIds = $.map(data, function(dataItem) { return dataItem.id; });
           // since id is numeric, and we will treat like an autoincrement field, find max
           var maxId = Math.max.apply(Math, currentIds);
           // increment by one
           return maxId + 1;
       };
    return service;
});
