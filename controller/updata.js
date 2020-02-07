//
//  與相關檔案功能
//

var fs = require('fs');
var multer = require('multer');
var db = require('../controller/db');
// var upload = multer({ dest: 'userData/' });


var rootFolder = './userData';
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
index.updata2 = upload.array('logo');
index.updata3 = function (req, res, next) {
  var files = req.files;
  // files.forEach(file => {
  //   console.log('檔案型別：%s', file.mimetype);
  //   console.log('原始檔名：%s', file.originalname);
  //   console.log('檔案大小：%s', file.size);
  //   console.log('檔案儲存路徑：%s', file.path);
  // });
  socket.emitMessage('popMessage', '上傳檔案完成');
  res.send({ okDataName: req.okDataName, errorDataName: req.errorDataName });
}

function deleteall(path, dataName) {
  // 刪除整份病例用
  // var files = [];
  // if (fs.existsSync(path)) {                     //確認是否存在
  //   files = fs.readdirSync(path);                //讀取該資料夾內的檔案
  //   files.forEach(function (file, index) {
  //     var curPath = path + "/" + file;
  //     if (fs.statSync(curPath).isDirectory()) {  //這是一個資料夾嗎?
  //       deleteall(curPath);
  //     } else { // delete file
  //       fs.unlinkSync(curPath);
  //     }
  //   });
  //   fs.rmdirSync(path);
  // }
};

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
    socket.emitMessage('popMessage', '有刪除東西喔!');
  } else {
    socket.emitMessage('popMessage', '不存在喔!');
  }
  res.end();
}

module.exports = index;