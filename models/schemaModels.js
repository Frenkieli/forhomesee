const mongoose = require('mongoose');
const moment = require('moment');


//注意資料庫都必須擁有time的欄位

const adminSchema = mongoose.Schema({
  id                : { type: String, require: true ,unique :true},
  password          : { type: String, require: true },
  name              : { type: String, require: true },
  permission        : { type: Number, require: true },
  status            : { type: Number, require: true },    //0正常,1黑名單
  socketId          : { type: String},                    // 儲存socketID訊息
  time              : { type: Number, require: true, default:moment().valueOf()},
});
// const messagesSchema = mongoose.Schema({
//   name              : { type: String, require: true },
//   msg               : { type: String, require: true },
//   time              : { type: Number, require: true, default:moment().valueOf()},
// });
const logSchema = mongoose.Schema({
  id                : { type: String, require: true },
  msg               : { type: String, require: true },
  detail            : { type: String},
  status            : { type: Number, require: true },    //0一般系統資訊, 1新增資訊 2變更資訊 3刪除資訊 
  target            : { type: Number, require: true },    //0會員, 1住民 2定位卡片 3刪除資訊 
  time              : { type: Number, require: true, default:moment().valueOf()},
});
const medicalRecordSchema = mongoose.Schema({
  _id               : { type: String, require: true},           //病歷號碼
  cardId            : { type: String},                          //病歷號碼
  name              : { type: String, require: true },          //這邊要在補上大量個人資料或是不用
  sex               : { type: Number, require: true },
  startTime         : { type: Number, require: true },          //卡片啟用和結束的時間
  endTime           : { type: Number, require: true },          //卡片啟用和結束的時間
  data              : { type: Object},                          //醫生上傳的資料
  playlist          : { type: Array} ,                          //醫生製作完成的放映順序
  musicplaylist     : { type: Array} ,                          //醫生製作完成的音樂順序
  time              : { type: Number, require: true, default:moment().valueOf()},                                 
},{id:false});
const advertisementRecordSchema = mongoose.Schema({
  _id               : { type: String, require: true},           //病歷號碼
  cardId            : { type: String},                          //病歷號碼
  name              : { type: String, require: true },          //這邊要在補上大量個人資料或是不用
  startTime         : { type: Number, require: true },          //卡片啟用和結束的時間
  endTime           : { type: Number, require: true },          //卡片啟用和結束的時間
  data              : { type: Object},                          //醫生上傳的資料
  playlist          : { type: Array} ,                          //醫生製作完成的放映順序
  musicplaylist     : { type: Array} ,                          //醫生製作完成的音樂順序
  time              : { type: Number, require: true, default:moment().valueOf()},                                 
},{id:false});

const locationCardSchema = mongoose.Schema({
  cardId            : { type: String, require: true, unique :true},
  status            : { type: Number, require: true },    //0正常,1遺失
  time              : { type: Number, require: true, default:moment().valueOf()},
})

module.exports = {
  admin: mongoose.model('admin', adminSchema),
  log: mongoose.model('log', logSchema),
  // messages: mongoose.model('Messages', messagesSchema),
  medicalRecord: mongoose.model('medicalRecord', medicalRecordSchema),
  advertisement: mongoose.model('advertisement',advertisementRecordSchema, 'advertisement'),
  locationCard: mongoose.model('locationCard', locationCardSchema),
};