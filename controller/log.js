var db = require('./db');

var index = {};

index.storeLog = async function(id , msg, status, target, detail) {
  let data = {
    id    : id,
    msg   : msg,
    detail: detail,
    status: status,
    target: target
  }
  let result = await db.create('log', data);
}

index.read = async function (req, res, next) {
  let result = await db.findDB('log', {}, '-time');
  res.json(result);
}

module.exports = index;