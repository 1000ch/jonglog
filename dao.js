var _ = require('underscore');
var MongoClinet = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var HOSTNAME = 'mongodb://127.0.0.1:27017/jonglog';
var Collections = {
  RESULT: 'result'
};

function get(callback) {
  try {
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
  } catch (e) {
    throw e;
  }
}

function add(docs, callback) {
  if (!docs) {
    throw new Error('Insert data is required.');
  }
  try {
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
  } catch (e) {
    throw e;
  }
}

function remove(selector, callback) {
  try {
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
  } catch (e) {
    throw e;
  }
}

module.exports = {
  get: get,
  add: add,
  remove: remove
};