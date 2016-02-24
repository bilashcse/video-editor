var async = require('async')

, mongoose = require('mongoose')
, User = mongoose.model('User')

module.exports = function (app,passport,auth,io) {
  
  // home route
  var index = require('../app/controllers/index');
  
  app.get('/', index.render);


/*****************   GET ************************/
app.get('/video/muteaudio',index.muteAudio);
app.get('/video/removevideo',index.removeVideo);
app.get('/video/information',index.videoInformation);
app.get('/video/thumbnail',index.videoThumbnail);
app.get('/video/text',index.videoText);

app.get('/video/cropvideo',index.cropVideo);
app.get('/video/watermark',index.watermark);




}