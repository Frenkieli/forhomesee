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
// 上傳病人照片
router.put('/personalPicture/:id',
  jwt.jwtRouteVerify,
  controller.personalPicture1,
  controller.personalPicture2,
  controller.personalPicture3)


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

// 刪除該病歷號碼的資料

router.delete('/:id',
  jwt.jwtRouteVerify,
  controller.delete);


// 顯示屏用或取病患資料不需要驗證
router.get('/dashboard/:id', 
  controller.dashboardRead);

// 獲取全部病歷資料

router.get('/',
  jwt.jwtRouteVerify,
  controller.getMedical)

module.exports = router;