const moment = require('moment');
require('moment/locale/zh-tw');
const socket = require('../socket/socket');
const config = require('../config/config').system;


var db = require('./db');
var log = require('./log');


var index = {};

var fs = require('fs');
var multer = require('multer');
var rootFolder = config.rootFolder;
var uploadFolder;


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
    cb(null, file.fieldname + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});


function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg)$/)) {
    req.errorDataName.push(file.originalname);
    return cb(null, false);
  } else if (file.originalname.match(/\.(jpg)$/)) {
    req.okDataName.img.push(file.originalname);
  }
  cb(null, true);
};


var upload = multer({ storage: storage, fileFilter: fileFilter });

// 確認資料庫卡片啟用日期不相衝

function checkCardTime (data, id) {
  return new Promise(async function(resolve, reject){
    let socketId = await db.findDB('admin' , { id : id});
    socketId = socketId[0].socketId;
    if(!data.cardId){
      socket.emitMessageToId(socketId, 'error', {
        str: '尚未指定使用的卡片' 
      });
      resolve(false);
    }else if(moment().valueOf() > data.endTime){
      socket.emitMessageToId(socketId, 'error', {
        str: '卡片結束日期已經逾期' 
      });
      resolve(false);
    }else{
      let quary = {
        _id : {$ne : data._id},
        cardId : data.cardId,
        endTime : { $gt : moment().valueOf()}
      }
      let result = await db.findDB('medicalRecord', quary);
      console.log(result);
      result.forEach(value => {
        let vs = value.startTime;
        let ve = value.endTime;
        let ds = data.startTime;
        let de = data.endTime;
        // if((value.startTime <= data.startTime && data.endTime <= value.endTime)){
        if((vs >= ds && vs <= de) || (ds >= vs && ds <= ve) || (ve >= ds && ve <= de) || (de >= vs && de <= ve)){
          socket.emitMessageToId(socketId, 'error', {
            str: '此卡片在　"' + moment(value.startTime).format('YYYY年MMMDo') + ' - ' + moment(value.endTime).format('YYYY年MMMDo') + '"　期間已經使用' 
          });
          resolve(false);
        }
      })
      resolve(true);
    }
  })
}

index.create = async function (req, res, next) {
  let data = req.body;
  let checkData = await checkCardTime(data, req.token.payload.id);
  if(checkData){
    let result = await db.create('medicalRecord',data);
    // let medicalRecord = schemaModels.medicalRecord
    if(result){
      socket.emitMessage('notice',{
        str:'病歷號：' + data._id + '，已建立'
      })
      log.storeLog(req.token.payload.id , '新增了' + result._id + '的住民治療方案' , 1, 1);
      let dataUpdate = {
        id    : data._id,
        name  : data.name
      }
      socket.emitMessage('medical_update' , dataUpdate)
    }else{
      socket.emitMessage('error',{
        str:'病歷號：' + data._id + '已經存在'
      })
    }
  }
  res.end();
}



index.personalPicture1 = async function (req, res, next) {
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
index.personalPicture2 = upload.array('personalPic');
index.personalPicture3 = function (req, res, next) {
  log.storeLog(req.token.payload.id , '修改了' + req.params.id + '的住民個人照片' , 2, 1);
  socket.emitMessage('notice', {
    str: '病歷號：' + req.params.id +'，檔案已新增' 
  });
  res.send({ okDataName: req.okDataName, errorDataName: req.errorDataName });
}


//獲取人員資料
index.read = async function (req, res, next) {
  let result = await db.findOneDB('medicalRecord',req.params.id);
  console.log(result);
  res.json(result);
}

//顯示屏用無權限獲取資料
index.dashboardRead = async function (req, res, next) {
  let result = await db.findOneDB('medicalRecord',req.params.id);
  log.storeLog('Dashboard' , '啟動了' + req.params.id + '的播放清單' , 0, 1);
  let data = {
    playlist      :result.playlist,
    musicplaylist :result.musicplaylist
  }
  res.json(data);
}

index.update = async function (req, res, next) {
  let data = req.body;
  let checkData = await checkCardTime(data, req.token.payload.id);
  if(checkData){
    let result = await db.update('medicalRecord',req.params.id, data);
    if(result){
    log.storeLog(req.token.payload.id , '更改了' + result._id + '的住民資訊' , 2, 1);
      socket.emitMessage('notice',{
        str:'病歷號：' + req.params.id + '，已更新'
      })
    }
  }
  res.end();
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


index.delete =async function(req, res, next) {
  let result = await db.destroy('medicalRecord',req.params.id);
  //  刪除整份病例用
  let path = rootFolder + '/' + req.params.id;
  var files = [];
  if (fs.existsSync(path)) {                     //確認是否存在
    files = fs.readdirSync(path);                //讀取該資料夾內的檔案
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {  //這是一個資料夾嗎?
        deleteall(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
  socket.emitMessage('notice',{
    str:'病歷號：' + req.params.id + '，所有資料已被刪除'
  })
  log.storeLog(req.token.payload.id , '刪除了' + req.params.id + '的住民治療方案與所有檔案' , 3, 1);
  socket.emitMessage('deleteNotice',req.params.id);
  res.end();
}

index.getMedical =async function(req, res, next) {
  let quary = {
    _id: {$ne : '0000000000'}
  }
  let result = await db.findDB('medicalRecord', quary);
  res.json(result);
}

module.exports = index;