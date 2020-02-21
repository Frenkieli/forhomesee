//
//    與帳號相關api
//
var express = require('express');
var router = express.Router();



var controller = require('../controller/admin')
var paramValidation =require('../config/param-validation')
var validata = require('express-validation'); //
var jwt = require('../controller/jwt');


// 新增人員
router.put('/',
jwt.jwtRouteVerify,
validata(paramValidation.createadmin),
controller.create)


// 取得登入令牌用
router.post('/',
  validata(paramValidation.loginadmin),
  controller.login);


// 修改人員資訊
router.post('/modify/:id',
  jwt.jwtRouteVerify,
  controller.modifyMember);

// 取得目前所有人員資訊
router.get('/',
  jwt.jwtRouteVerify,
  controller.getMemberInfo);
// router.delete('/',
//   controller.delete);

// 刪除目前人員
router.delete('/:id',
  jwt.jwtRouteVerify,
  controller.deleteMember)

// router.get('/:id', controller.read);

module.exports = router;