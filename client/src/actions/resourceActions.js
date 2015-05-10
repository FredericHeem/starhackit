"use strict";
var reflux = require("reflux");
var dataInterface = require("local/core/dataInterface");

// Create actions
var actions = reflux.createActions([
  // Get
  "loadResource",
  "loadResourceSuccess",
  "loadResourceFail",

  // Create
  "createResource",
  "createResourceSuccess",
  "createResourceFail",

  // Update
  "updateResource",
  "updateResourceSuccess",
  "updateResourceFail",

  // Remove

  // Error
  "resourceNotFound"
]);

// Action handlers
actions.loadResource.listen(function(type, id, childrenType) {
  dataInterface.get("/v1/" + [type, id, childrenType].filter(function(e) { return e; }).join("/"))
    .then(function(data) {
      actions.loadResourceSuccess(type, id, childrenType, data);
    })
    .catch(function(jqXHR, textStatus, errorThrown) {
      actions.loadResourceFail(type, id, childrenType, textStatus, errorThrown);
    });
});

actions.createResource.listen(function(type, data, navigateTo) {
  dataInterface.post("/v1" + [type].filter(function(e) { return e; }).join("/"), data)
    .then(function(resultData) {
      actions.createResourceSuccess(type, resultData);

      // Navigate to resource
      if (navigateTo) {
        var router = require("local/core/router").router;
        //var urlCreator = require("local/helper/resourceUrlCreator");
        //var url = urlCreator(type, resultData);
        var url = "/";
        router.transitionTo(url);
      }
    })
    .catch(function(jqXHR, textStatus, errorThrown) {
      actions.createResourceFail(type, textStatus, errorThrown);
    });
});

module.exports = actions;
