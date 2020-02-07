//
//    上傳檔案相關api
//

var express = require('express');
var router = express.Router();
var jwt = require('../controller/jwt');

var controller = require('../controller/updata')

// 上傳大量該病例檔案
router.post('/:id',
  jwt.jwtRouteVerify,
  controller.updata1,
  controller.updata2,
  controller.updata3);

// 刪除目標檔案
router.delete('/',
  controller.delete);

// 撈取該病例目前擁有的檔案
router.get('/:id',
  jwt.jwtRouteVerify,
  controller.read);

module.exports = router;