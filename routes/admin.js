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

// router.delete('/',
//   controller.delete);


// router.get('/:id', controller.read);

module.exports = router;