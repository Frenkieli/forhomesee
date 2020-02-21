var db = require('./db');
var log = require('./log');

// const schemaModels = require('../models/schemaModels');

var index = {};

index.getCardInfo = async function (req, res, next) {
  let result = await db.findDB('locationCard');
  console.log(result);
  res.send(result);
}

index.createCard = async function (req, res, next) {
    let data = {
      cardId: req.body.cardId,
      status: req.body.status
    }
    let cheack = await db.findOneQueryDB('locationCard' , { cardId : req.body.cardId});
    if(!cheack){
      let result = await db.create('locationCard', data);
      log.storeLog(req.token.payload.id , '新增了' + result.cardId + '的定位卡片' , 1 ,2);
      // let medicalRecord = schemaModels.medicalRecord
      res.send(result);
    }else{
      res.send(false);
    }
}

index.modifyCard = async function (req, res, next) {
  let result = await db.update('locationCard',req.params.id, req.body);
  log.storeLog(req.token.payload.id , '更動了' + result.cardId + '的定位卡片資訊' , 2, 2);
  res.send(result);
}

index.deleteCard = async function (req, res, next) {
  let result = await db.destroy('locationCard',req.params.id);
  log.storeLog(req.token.payload.id , '刪除了' + result.cardId + '的定位卡片' , 3, 2);
  res.send(result);
}

module.exports = index;