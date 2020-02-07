var db = require('./db');

// const schemaModels = require('../models/schemaModels');

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


var index = {};

index.create = async function (req, res, next) {
  // let data = req.body;
  let data = {
    id: req.body.id,
    password: bcrypt.hashSync(req.body.password, 5),
    name: req.body.name,
  }
  let result = await db.create('admin', data);
  // let medicalRecord = schemaModels.medicalRecord
  console.log(result);
  res.end();
}

index.login = async function (req, res, next) {
  let data = req.body; //id password
  let query = {
    id: req.body.id
  }
  let result = await db.findQueryDB('admin', query)
  if (result) {
    let inpassword = req.body.password;
    let DBpassword = result.password;
    bcrypt.compare(inpassword, DBpassword).then(value => {
      if (value) {
        let payload = {
          id: req.body.id,
          data: new Date()
        }
        let token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, 'token_key');
        console.log(token);
        // schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
        // res.redirect('/medical');
        // res.render('medical', { title: 'Express' , token_key: token , medicalRecord :data})
        res.json(token)
        // })
      } else {
        res.send(value);
      }
    })
  }
}

module.exports = index;