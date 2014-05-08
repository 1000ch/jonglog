var _ = require('underscore');
var MongoClinet = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var HOSTNAME = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/jonglog';
var Collections = {
  RESULT: 'result'
};

function get(callback) {
  MongoClinet.connect(HOSTNAME, function (error, db) {
    if (error) {
      throw error;
    }
    var collection = db.collection(Collections.RESULT);
    collection.find().toArray(function (error, results) {
      if (error) {
        throw error;
      }
      callback(results);
    });
  });
}

function add(docs, callback) {
  if (!docs) {
    throw new Error('Insert data is required.');
  }
  MongoClinet.connect(HOSTNAME, function (error, db) {
    if (error) {
      throw error;
    }
    var collection = db.collection(Collections.RESULT);
    collection.insert(docs, function (error, results) {
      if (error) {
        throw error;
      }
      callback(results);
    });
  });
}

function remove(selector, callback) {
  if (selector._id) {
    selector._id = ObjectID(selector._id);
  }
  MongoClinet.connect(HOSTNAME, function (error, db) {
    if (error) {
      throw error;
    }
    var collection = db.collection(Collections.RESULT);
    collection.remove(selector, function (error, results) {
      if (error) {
        throw error;
      }
      callback(results);
    });
  });
}

function distinct(key, callback) {
  MongoClinet.connect(HOSTNAME, function (error, db) {
    if (error) {
      throw error;
    }
    var collection = db.collection(Collections.RESULT);
    collection.distinct(key, function (error, results) {
      if (error) {
        throw error;
      }
      callback(results);
    });
  });
}

module.exports = {
  get: get,
  add: add,
  remove: remove,
  distinct: distinct
};