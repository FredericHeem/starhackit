var Promise = require('bluebird');
//var _ = require('underscore-node');
module.exports = function(/*app*/) {  
  "use strict";
  //var log = app.log.get(__filename);
  /**
   * Upsert contents  into model
   *
   * @param {Object} model  - The model to upsert 
   * @param {Object} contents - Object array , representation of records inside model
   * @returns {Promise} Promise upsert result
   */
  function upsertRows(model, contents) {
    //log.debug("upsertRows length ", contents.length);
    return Promise.each(contents, function(content) {
      //log.debug("upsertRows content ", content);
      return model.upsert(content)
       .then(function () {
        //log.debug('upsertRows content DONE  ', content);
       });
    })
    .then(function () {
      //log.debug('upsertRows ALL DONE  ', contents.length);
    });
  }
  
  return {
    upsertRows: upsertRows
  };
};

