var express = require('express');
var router = express.Router();
var jwt = require('../controller/jwt');

var controller = require('../controller/medicalrecords')

// router.put('/',
// controller.create)

// 建立病例人員
router.put('/',
  jwt.jwtRouteVerify,
  controller.create)


// 修改該人員的資料
router.post('/:id',
  jwt.jwtRouteVerify,
  controller.update);


// router.delete('/',
//   controller.delete);

// 獲取該病歷人員資料的資料
router.get('/:id', 
  jwt.jwtRouteVerify,
  controller.read);

module.exports = router;