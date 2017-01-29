var express = require('express');
var fs = require('fs');
var http = require("http");
var promise = require('bluebird');
var mkdirp = promise.promisify(require('mkdirp'));
var env = process.env.NODE_ENV || 'production';
var bodyParser = require('body-parser');


/* ---------------- Server Controller ------------------*/
var editorCtrl = require('./server/editor');

function Server(){

    this.app = express();

    this.start = function(){
    	http.createServer(this.app).listen(process.env.PORT || 3000);
		console.log('Onlive video editor is Running successfully on environment : '+env);
    };
    this.routingSetUp = function(){
         editorCtrl(this.app);
    };
    this.setupExpressMiddleware = function(){
        var dir = __dirname + '/videos';
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);

        this.app.use(express.static(dir));
    };
    this.exportsApp = function(){
    	exports = module.exports = this.app;
    };
}


var server = new Server();
server.start();
server.setupExpressMiddleware();
server.routingSetUp();
server.exportsApp();