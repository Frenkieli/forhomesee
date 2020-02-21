//==
//
//  socket功能
//
//
var express = require('express');
const moment = require('moment');


var app = express();

// var server = require('http').Server(app);
var io = {}

var db = require('../controller/db');

var index = {};

var socketid = false;

index.init = function (server) {
  io = require('socket.io').listen(server);
  io.on('connection', index.connectionSocket);
}
index.connectionSocket = async function (socket) {
  let handshakeData = socket.request;
  let comeInName = handshakeData._query['name'];
  if(comeInName != 'false'){
    let result = await db.updateQuery('admin', {id : comeInName}, { socketId :socket.id});
  }
  // console.log(socket.handshake);
  // console.log("誰進來了:", comeInName);
  // socketHander.connect();
  // const history = await socketHander.getMessages();
  // const history = await db.findDB('messages');
  // io.to(socketid).emit('history', history);

  // console.log(comeInName + ' 加入聊天室');
  // index.emitMessage('message', { name: comeInName, msg: ' 加入了聊天室' });
  socket.on("disconnect", () => {
    console.log('離開');
    // index.emitMessage('message', { name: comeInName, msg: " 默默的離開了聊天室" });
  });

  // socket.on("message", (obj) => {
  //   index.emitMessage("message", '應聲蟲:' + obj);
  // });

  socket.on("message", async (obj) => {
    // socketHander.storeMessages(obj);
    let result = await db.create('messages',obj);
    index.emitMessage("message", result);
  });

  socket.on("deleteMessage",async (obj)=>{
    console.log(obj);
    let result = await db.destroy('messages',obj._id);
    index.emitMessage("deleteMessage", result);
  })

  socket.on("updateMessage",async (obj)=>{
    console.log(obj);
    let result = await db.update('messages',obj._id,obj);
    index.emitMessage("updateMessage", result);
  })



}

index.readCard = async function(cardNum){
  // 測試用
  let nowTime = moment().valueOf();
  let quary = {
    cardId : cardNum,
    startTime : {$lt : nowTime},
    endTime : {$gt : nowTime}
  }
  let result = await db.findDB('medicalRecord', quary);
  // 從這邊去注意有沒有怪怪的，然後再去做儲存確認的工作
  console.log(result);
  if(result.length !=0){
    index.emitMessage('playVideo', result[0]._id);
  }
}

index.emitMessage = function (obj, message) {
  io.emit(obj, message)
}

index.emitMessageToId = function (id, obj, message) {
  io.to(id).emit(obj, message)
}


module.exports = index;