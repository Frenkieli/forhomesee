var db = require('./db');
var log = require('./log');
// const schemaModels = require('../models/schemaModels');

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


var index = {};
// 刪除人員檔案
index.deleteMember = async function (req, res, next) {
  let result = await db.destroy('admin',req.params.id);
  log.storeLog(req.token.payload.id , '刪除了' + result.id + '的會員帳號' , 3, 0);
  res.send(result);
}

// 修改人員檔案
index.modifyMember = async function (req, res, next) {
  let result = await db.update('admin',req.params.id, req.body);
  log.storeLog(req.token.payload.id , '修改了' + result.id + '的會員資訊' , 2, 0);
  res.send(result);
}

// 獲取所有人員資訊
index.getMemberInfo = async function (req, res, next) {
  let result = await db.findDB('admin');
  console.log(result);
  let data = [];
  result.forEach(value=>{
    let obj = {
      _id         : value._id,
      id          : value.id,
      name        : value.name,
      permission  : value.permission,
      status      : value.status,
      time        : value.time
    }
    data.push(obj);
  })
  res.json(data);
}

index.create = async function (req, res, next) {
  // let data = req.body;
  let data = {
    id: req.body.id,
    password: bcrypt.hashSync(req.body.password, 5),
    name: req.body.name,
    permission: req.body.permission,
    status    : req.body.status
  }
  let cheack = await db.findOneQueryDB('admin' , { id : req.body.id});
  if(!cheack){
    let result = await db.create('admin', data);
    // let medicalRecord = schemaModels.medicalRecord
    log.storeLog(req.token.payload.id , '建立了' + result.id + '的會員帳號' , 1, 0);
    res.send(result);
  }else{
    res.send(false);
  }
}

index.login = async function (req, res, next) {
  try {
    let data = req.body; //id password
    let query = {
      id: req.body.id
    }
    let result = await db.findOneQueryDB('admin', query);
    if (result) {
      log.storeLog(result.id ,'登入了感官治療系統' , 0, 0);
      let inpassword = req.body.password;
      let DBpassword = result.password;
      bcrypt.compare(inpassword, DBpassword).then(value => {
        if (value) {
          let payload = {
            id: req.body.id,
            data: new Date()
          }
          let token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 30) }, 'token_key');
          console.log(token);
          // schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
          // res.redirect('/medical');
          // res.render('medical', { title: 'Express' , token_key: token , medicalRecord :data})
          res.json(token)
          // })
        } else {
          res.send(value);
        }
      })
    }
  } catch (error) {
    res.send('驗證失敗');
  }
}

module.exports = index;