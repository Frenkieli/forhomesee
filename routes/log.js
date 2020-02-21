var express = require('express');
var router = express.Router();
var jwt = require('../controller/jwt');

var controller = require('../controller/log')

// 撈取所有歷史紀錄
router.get('/',
  jwt.jwtRouteVerify,
  controller.read);

module.exports = router;