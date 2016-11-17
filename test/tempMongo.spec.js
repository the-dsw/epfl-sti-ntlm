var chai = require('chai'),
    expect = chai.expect,
    MongoClient = require('mongodb').MongoClient,
    Q = require("q"),
    MongoClientConnectP = Q.nbind(MongoClient.connect, MongoClient),
    makeTempMongoP = require("./lib/tempMongo.js").makeTempMongoP,
    listCollectionsP = require("./lib/tempMongo.js").forTestsOnly.listCollectionsP;

Q.longStackSupport = true;

describe("tempMongo", function () {

    it("creates a database that you can connect to",function () {
        return makeTempMongoP().then(function (temp) {
            return MongoClientConnectP(temp.uri());
        }).then(function (db) {
            expect(db).to.respondTo("createCollection");

        });
    });

    /**
     * Connect to a new temporary MongoDB, and ensure that it is empty.
     * @returns {Promise} A promise on a db object that the caller can use further
     */
    function connectToDbExpectNoCollectionsP() {
        var db;
        return makeTempMongoP().then(function (tempMongo) {
            return MongoClientConnectP(tempMongo.uri());
        }).then(function (db_) {
            db = db_;
            return Q.nbind(db.collections, db)();
        }).then(function (names) {
            expect(names).to.have.length(0);
            return db;
        });;
    }
    it("has no collections upon creation (but it lets you create one)", function () {
        var db;
        return connectToDbExpectNoCollectionsP().then(function (db_) {
            db = db_;
            return Q.nbind(db.createCollection, db)("test")
        }).then(function () {
            return Q.nbind(db.collections, db)();
        }).then(function (names) {
            expect(names).to.have.length(1);
        });
    });
    it("still has no collections (despite the previous test having created one!)", function () {
        return connectToDbExpectNoCollectionsP();
    });

    it("deletes the database at the end");
    it("creates many databases, and each has a different connection string");
});

describe("listCollectionsP", function () {
    it("lists the collections");
});