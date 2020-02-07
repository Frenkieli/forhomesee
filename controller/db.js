//
//    對db的操控放在這邊
//

const schemaModels = require('../models/schemaModels');
const moment = require('moment');
const mongoose = require('mongoose');

// C
exports.create = function (collectionName, inserObject) {
  return new Promise(function (resolve, reject) {
    let data = new schemaModels[collectionName];
    for (let key in inserObject) {
      data[key] = inserObject[key];
    }
    data.save(function (err, data, count) {
      if (err) reject(err);
      resolve(data);
    });
  })
}

// R 搜尋編號治療
exports.findDB = function (collectionName) {
  return schemaModels[collectionName].find().sort('time'); //可以加正負號 -號是小的在前
}

// R one

exports.findOneDB = function (collectionName,id) {
  return schemaModels[collectionName].findById(id).sort('time'); //可以加正負號 -號是小的在前
}

// R

exports.findQueryDB = function (collectionName,query) {
  return schemaModels[collectionName].findOne(query).sort('time'); //可以加正負號 -號是小的在前
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

//D
exports.destroy = function (collectionName, id) {
  return new Promise(function (resolve, reject) {
    schemaModels[collectionName].findById(id, function (err, data) {
      data.remove(function (err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  });
};

mongoose.set('useCreateIndex', true) //加上这个
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true });