//
//    與定位卡片的相關API
//
var express = require('express');
var router = express.Router();



var controller = require('../controller/location')
var jwt = require('../controller/jwt');

// 取得目前所有卡片資訊
router.get('/',
  jwt.jwtRouteVerify,
  controller.getCardInfo);
// router.delete('/',
//   controller.delete);

// 新增卡片
router.put('/',
  jwt.jwtRouteVerify,
  controller.createCard)

// 刪除卡片
router.delete('/:id',
  jwt.jwtRouteVerify,
  controller.deleteCard) 
// router.get('/:id', controller.read);

// 修改卡片

router.post('/modify/:id',
  jwt.jwtRouteVerify,
  controller.modifyCard);

module.exports = router;