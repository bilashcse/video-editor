
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , passport=require('passport')
  , logger = require('mean-logger')
  , path = require('path')
  
 


var env = process.env.NODE_ENV || 'production'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

var db = mongoose.connect(config.db)

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	// console.log(models_path+'/'+file);
  require(models_path+'/'+file)
})

var _ = require("underscore");
require('./config/passport')(passport, config,_)


var app = express()
, http = require("http").createServer(app)
, io = require("./io")//.listen(http)


require('./config/express')(app,config,passport)
require('./config/routes')(app,passport,auth,io)

var port = process.env.PORT || 80
var listen = http.listen(port)
io.set('log level', 2);
io.attach(listen);

console.log('LootBot started on port '+port+" on mode: "+env);
logger.init(app, passport, mongoose)
exports = module.exports = app