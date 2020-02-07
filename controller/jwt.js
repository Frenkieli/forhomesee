var jwt = require('jsonwebtoken');

let index ={};

index.jwtVerify = function(token) {
  return new Promise((resole,reject)=>{
    jwt.verify(token, 'token_key',(err,payload)=>{
        if(err){
          resole(false);
        }else{
          resole(payload.payload.id);
        }
    });
  })
}

index.jwtRouteVerify =  function(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' '); // 字串切割
    const bearerToken = bearer[1]; // 取得 JWT
    req.token = bearerToken; // 在response中建立一個token參數
    jwt.verify(req.token, 'token_key',(err,payload)=>{
        if(err){
          res.send('時效到期請重新登入');
        }else{
          req.token = payload;
          next();
        }
    });
  }else{
    res.send('驗證失敗');
  }
}
module.exports = index;