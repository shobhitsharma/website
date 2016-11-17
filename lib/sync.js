/**
 * Syncs MongoDB documents to ElasticSearch
 *
 * @module Sync
 * @fileoverview Syncing mongodb models, docs into elastisearch cluster
 */

var MongoClient = require('mongodb').MongoClient;
var elasticsearch = require('elasticsearch');

// Use Q if native promises are not available
if (typeof Promise === 'undefined') {
  Promise = require('q').Promise;
}

/**
 * Sync Prototype
 *
 * @class
 * @param {object} config Configuration parameters.
 */
function Sync(config) {
  if (!config || !config.esOptions || !config.esOptions.host || !config.mongoUri) {
    throw new Error('Invalid config.  esOptions and mongoUri are required');
  }
  if (!config.esTargetIndex) {
    throw new Error('esTargetIndex is required');
  }
  if (!config.mongoSourceCollection) {
    throw new Error('mongoSourceCollection is required');
  }
  if (!config.esTargetType) {
    throw new Error('esTargetType is required');
  }
  this.ES = new elasticsearch.Client(config.esOptions);
  this.esOptions = config.esOptions;
  this.mongoUri = config.mongoUri;
  this.mongoSourceCollection = config.mongoSourceCollection;
  this.debug = config.debug;
  this.esTargetIndex = config.esTargetIndex;
  this.esTargetType = config.esTargetType;
}

/**
 * For testing purposes only
 *
 * @param {any} newClient
 */
Sync.prototype.__setESClient = function (newClient) {
  this.ES = newClient;
};

/**
 *
 *
 * @returns
 */
Sync.prototype.connectToMongo = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(this.mongoUri, function (err, db) {
      if (err) {
        return reject(err);
      }
      this.db = db;
      resolve(db);
    }.bind(this));
  }.bind(this));
};

/**
 *
 *
 * @param {any} doc
 * @returns
 */
Sync.prototype.createESDocument = function (doc) {
  return new Promise(function (resolve, reject) {
    // Let ES generate IDs
    if (doc._id) {
      delete doc._id;
    }
    if (doc.id) {
      delete doc.id;
    }
    this.ES.create({
      index: this.esTargetIndex,
      type: this.esTargetType,
      body: doc
    }, function (err, res) {
      if (err) {
        console.log('error', err);
        return reject(err);
      }
      resolve(res);
    });
  }.bind(this));
};

/**
 *
 *
 * @returns
 */
Sync.prototype.getCollection = function () {
  if (!this.db) {
    throw new Error('No DB connection');
  }
  return this.db.collection(this.mongoSourceCollection);
};

/**
 *
 *
 * @returns
 */
Sync.prototype.findBatchedDocuments = function () {
  return new Promise(function (resolve, reject) {
    try {
      var collection = this.getCollection(this.db);
    } catch (e) {
      reject(e);
    }
    var cursor = collection.find({});
    this.cursor = cursor;
    var timer;
    var counter = 0;
    var writePromises = [];

    /**
     *
     *
     * @param {any} doc
     * @returns
     */
    var getNext = function (doc) {
      if (doc) {
        ++counter;
        try {
          var p = this.createESDocument(doc);
          writePromises.push(p);
        } catch (e) {
          reject(e);
        }
      }
      return cursor.hasNext().then(function (bool) {
        if (bool) {
          cursor.next().then(getNext);
        } else {
          Promise.all(writePromises).then(function () {
            if (this.timeout) {
              clearTimeout(timer);
            }
            resolve({
              status: 'ok',
              documentsAdded: counter
            });
          });
        }
      });
    }.bind(this);

    if (this.timeout) {
      timer = setTimeout(
        function () {
          reject({
            status: 'timeout',
            message: ('Timed out after ' + this.timeout + 'ms')
          });
        }.bind(this),
        this.timeout
      );
    }

    getNext().catch(reject);

  }.bind(this));
};

/**
 *
 *
 * @returns
 */
Sync.prototype.start = function () {
  return new Promise(function (resolve, reject) {
    this.connectToMongo()
      .then(this.findBatchedDocuments.bind(this))
      .then(function (res) {
        if (this.db) {
          this.db.close();
        }
        resolve(res);
      })
      .catch(reject);
  }.bind(this));
};

module.exports = Sync;
