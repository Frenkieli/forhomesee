//
//  判斷吐出什麼頁面並獲取相關資料
//
var express = require('express');
var router = express.Router();
var ip = require("ip");


let ipAddress = ip.address() + (process.env.NODE_Server == 'frenkie' ? ':3000' : '');
var jwt = require('../controller/jwt');

const schemaModels = require('../models/schemaModels');

var db = require('../controller/db');
const moment = require('moment');


// 下方get進入登入頁即可用post進入此判斷
// 登入成功部分會分別吐出
// 醫護人員用 管理者用 頁面
router.post('/', async function(req, res ,next) {
  let result = await jwt.jwtVerify(req.body.token);
  let payload = result;
  if(payload){
    console.log(payload.payload.id);
    let query = {
      id: payload.payload.id
    }
    let resultAdmin = await db.findOneQueryDB('admin', query);
    console.log(resultAdmin);
    if(resultAdmin.permission==1 && req.body.adminMode == 'true'){
      res.render('admin', { title: 'snoezelenTherapy', loginId: payload.payload.id , ip: ipAddress, name : resultAdmin.name , token_key: req.body.token , time: moment(payload.exp * 1000).format('h:mm:ss')});
    }else if(req.body.adminMode == 'true' && resultAdmin.permission !=1){
      // 不是管理人員
      res.render('index', { title: 'snoezelenTherapy' , error: '沒有管理員權限'});
    }else{
      let query = {
        endTime : {$gt : moment().valueOf()}
      }
      if(resultAdmin.permission !=1){
        query._id = {$ne : '0000000000'};
      }
      db.findDB('medicalRecord', query).exec(async function( err , data){
        // 吐出卡片id號碼
        let result = await db.findDB('locationCard',{ status : 0})
        res.render('medical', { title: 'snoezelenTherapy', loginId: payload.payload.id , ip: ipAddress , medicalRecord: data , card: result , token_key: req.body.token , time: moment(payload.exp * 1000).format('h:mm:ss')});
      })
    }
  }else{
    // res.redirect('index');
    res.render('index', { title: 'snoezelenTherapy' , error: '認證逾期，重新登入'});
  }
  // jwt.verify(req.body.token, 'token_key',(err,payload)=>{
  //     if(err){
  //       res.redirect('index');
  //     }else{
  //       console.log(payload);
  //       schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
  //         res.render('medical', { title: 'snoezelenTherapy', ip: ipAddress , medicalRecord: data , token_key: req.body.token});
  //       })
  //     }
  // });
});

/* GET home page. */
router.get('/', function(req, res ,next) {
  res.render('index', { title: 'snoezelenTherapy' , error: ''});
});

/* play page */
router.get('/play',function(req, res ,next) {
  res.render('play', { title: 'snoezelenTherapy', ip: ipAddress});
})

module.exports = router;
