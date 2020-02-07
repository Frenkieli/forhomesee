//
//  判斷吐出什麼頁面並獲取相關資料
//
var express = require('express');
var router = express.Router();

var jwt = require('../controller/jwt');

const schemaModels = require('../models/schemaModels');


// 下方get進入登入頁即可用post進入此判斷
// 登入成功部分會分別吐出
// 醫護人員用 管理者用 頁面
router.post('/', async function(req, res ,next) {
  let result = await jwt.jwtVerify(req.body.token);
  if(result){
    console.log(result);
    schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
      res.render('medical', { title: 'Express' , medicalRecord: data , token_key: req.body.token});
    })
  }else{
    res.redirect('index');
  }
  // jwt.verify(req.body.token, 'token_key',(err,payload)=>{
  //     if(err){
  //       res.redirect('index');
  //     }else{
  //       console.log(payload);
  //       schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
  //         res.render('medical', { title: 'Express' , medicalRecord: data , token_key: req.body.token});
  //       })
  //     }
  // });
});

/* GET home page. */
router.get('/', function(req, res ,next) {
    res.render('index', { title: 'Express'});
});

module.exports = router;
