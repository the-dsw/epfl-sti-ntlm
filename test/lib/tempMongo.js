const connectURI = "mongodb://localhost";
var
    Q = require("Q"),
    MongoClient = require('mongodb').MongoClient;

module.exports.forTestsOnly = {};

/**
 * Main entry point: promise a fresh MongoDB instance.
 */
module.exports.makeTempMongoP = function() {
    return eraseAllCollectionsP().then(function() {
        return {
            uri: function() {
                return connectURI;
            }
        }
    });
};

var listCollectionsP = module.exports.forTestsOnly.listCollectionsP = function listCollectionsP(db) {
    var deferred = Q.defer();
    db.collections(deferred.makeNodeResolver());
    return deferred.promise;
};

function mongoConnectP() {
    var deferred = Q.defer();
    MongoClient.connect(connectURI, deferred.makeNodeResolver());
    return deferred.promise;
}

function mongoDeleteCollectionP(collection){
    var deferred = Q.defer();
    collection.drop(deferred.makeNodeResolver());
    return deferred.promise;
}
/**
 * Erase all collections in database at mongodb://localhost
 * @returns {Promise} A promise that there are no connections.
 */
function eraseAllCollectionsP() {
    var deletionPromises = [];
    return mongoConnectP().then(function (db) {
        return listCollectionsP(db);
    }).then(function(listColNames) {
      listColNames.forEach(function (collection) {
          deletionPromises.push(mongoDeleteCollectionP(collection));
      });
    }).then(function() {
        return Q.all(deletionPromises);
    });
}
