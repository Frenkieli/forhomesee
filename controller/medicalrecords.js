var db = require('./db');

var index = {};

const socket = require('../socket/socket');

index.create = async function (req, res, next) {
  let data = req.body;
  let result = await db.create('medicalRecord',data);
  // let medicalRecord = schemaModels.medicalRecord
  socket.emitMessage('popMessage', '創建按鈕');
  socket.emitMessage('createRecord', result);
}

index.read = async function (req, res, next) {
  let result = await db.findOneDB('medicalRecord',req.params.id);
  console.log(result);
  res.json(result);
}

index.update = async function (req, res, next) {
  let result = await db.update('medicalRecord',req.params.id,{playlist:req.body});
  console.log(result);
  res.end();
}

module.exports = index;