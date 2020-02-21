//
//  與相關檔案功能
//

var fs = require('fs');
var multer = require('multer');
var db = require('../controller/db');
var log = require('./log');
// var upload = multer({ dest: 'userData/' });
const config = require('../config/config').system;



var rootFolder = config.rootFolder;
var uploadFolder;

const schemaModels = require('../models/schemaModels')
const socket = require('../socket/socket');

var index = {};


var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);    
  }
};
createFolder(rootFolder);


var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, uploadFolder);  // 儲存的路徑，備註：需要自己建立
  },
  filename: function (req, file, cb) {
    // 將儲存檔名設定為 欄位名   時間戳，比如 logo-1478521468943
    // cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    cb(null, file.originalname);
  }
});


function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|ogg|mp3)$/)) {
    req.errorDataName.push(file.originalname);
    return cb(null, false);
  } else if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    req.okDataName.img.push(file.originalname);
  } else if (file.originalname.match(/\.(mp4|ogg)$/)) {
    req.okDataName.video.push(file.originalname);
  } else if (file.originalname.match(/\.(mp3)$/)) {
    req.okDataName.music.push(file.originalname);
  }
  cb(null, true);
};


var upload = multer({ storage: storage, fileFilter: fileFilter });

index.updata1 = async function (req, res, next) {
  req.errorDataName = [];
  req.okDataName = {
    img: [],
    music: [],
    video: []
  };
  uploadFolder = rootFolder + '/' + req.params.id;
  createFolder(uploadFolder);
  next();
}
index.updata2 = upload.array('file');
index.updata3 = function (req, res, next) {
  socket.emitMessage('notice', {
    str: '病歷號：' + req.params.id +'，檔案已新增' 
  });
  log.storeLog(req.token.payload.id , '新增了' + req.params.id + '的住民治療方案檔案' , 1, 1);
  res.send({ okDataName: req.okDataName, errorDataName: req.errorDataName });
}

index.read = function (req, res, next) {
  let id = req.params.id;
  if(fs.existsSync('./userData/' + id)){
    files = fs.readdirSync('./userData/' + id);
    res.send(files);
  }else{
    res.send(false);
  }
  // var form = fs.readFileSync('./index.html', { encoding: 'utf8' });
}

index.delete = function (req, res, next) {
  let data = req.body.id + '/' + req.body.deleteName;
  if (fs.existsSync('userData' + '/' + data)) {
    fs.unlinkSync('userData' + '/' + data);
    log.storeLog(req.token.payload.id , '刪除了' + req.body.id + '的'+ req.body.deleteName + '檔案' , 3, 1);
    socket.emitMessage('notice',{
      str:'病歷號：' + req.body.id + '，' + req.body.deleteName + '已刪除'
    })
  } else {
    socket.emitMessage('notice',{
      str:req.body.deleteName + '檔案不存在'
    })
  }
  res.send(true);
}

module.exports = index;