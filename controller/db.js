//
//    對db的操控放在這邊
//

const schemaModels = require('../models/schemaModels');
const moment = require('moment');
const mongoose = require('mongoose');
const config = require('../config/config').db;
// C
exports.create = function (collectionName, inserObject) {
  return new Promise(function (resolve, reject) {
    let data = new schemaModels[collectionName];
    for (let key in inserObject) {
      data[key] = inserObject[key];
    }
    data.save(function (err, data, count) {
      if (err) resolve(false);
      resolve(data);
    });
  })
}

// R 搜尋編號
exports.findDB = function (collectionName, query={}, sort = '_id') {
  return schemaModels[collectionName].find(query).sort(sort); //可以加正負號 -號是小的在前
}

// R one

exports.findOneDB = function (collectionName,id) {
  return schemaModels[collectionName].findById(id); //可以加正負號 -號是小的在前
}

// R

exports.findOneQueryDB = function (collectionName,query) {
  return schemaModels[collectionName].findOne(query); //可以加正負號 -號是小的在前
}

//U
exports.update = function (collectionName, id, inserObject) {
  return new Promise(function (resolve, reject) {
    inserObject.time = moment().valueOf();
    schemaModels[collectionName].findById(id, function (err, data) {
      for (let key in inserObject) {
        data[key] = inserObject[key];
      }
      data.save(function (err, todo, count) {
        if (err) reject(err);
        resolve(data);
      });
    })
  })
}

exports.updateQuery = function (collectionName, query, inserObject) {
  return new Promise( function (resolve, reject) {
    inserObject.time = moment().valueOf();
    schemaModels[collectionName].findOne(query, function (err, data) {
      for (let key in inserObject) {
        data[key] = inserObject[key];
      }
      data.save(function (err, todo, count) {
        if (err) reject(err);
        resolve(data);
      });
    })
  })
}

//D
exports.destroy = function (collectionName, id) {
  return new Promise(function (resolve, reject) {
    schemaModels[collectionName].findById(id, function (err, data) {
      if(data){
        data.remove(function (err, data) {
          if (err) return reject(err);
          resolve(data);
        });
      }else{
        resolve(false);
      }
    });
  });
};

mongoose.set('useCreateIndex', true) //加上这个
if (process.env.PKGVersion != undefined) {
  console.log(`mongodb://${config.host}:${config.port}/${config.db}` + process.env.PKGVersion);
  mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}` + process.env.PKGVersion, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
  console.log(`mongodb://${config.host}:${config.port}/${config.db}`);
  mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}`, { useNewUrlParser: true, useUnifiedTopology: true });
}