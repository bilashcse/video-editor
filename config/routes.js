var async = require('async')

, mongoose = require('mongoose')
, User = mongoose.model('User')

module.exports = function (app,passport,auth,io) {
  
  // home route
  var index = require('../app/controllers/index');
  


  // user routes
  var users = require('../app/controllers/users');

  app.get('/', index.render);
  app.get('/home',auth.requiresLogin,users.success);


  app.post('/registration',users.create); //signup new user
  app.post('/recoverPassword', users.recoverPassword); //forgot password   
  app.post('/sendMessage',users.messageSend); // send Message

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me', 'read_stream', 'publish_actions','publish_stream'], failureRedirect: '/' }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebook' }), users.authCallback);
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/#invalidEmailOrPassword', failureFlash: 'Invalid email or password.'}), users.session);
  app.post('/search', users.search_music);

  app.get('/signout',auth.requiresLogin, users.signout);
  app.get('/confirm_email', users.confirm_email);
  app.get('/waitingConfirmation',users.waitingConfirmation);
  app.get('/confirmActivation',users.confirm_activation);
  app.post('/setPassword',auth.requiresLogin,users.setPassword);
  app.get('/users/getTimeForecast',auth.requiresLogin,users.getTimeForecast);
  app.post('/users/editProfile',auth.requiresLogin,users.editProfile);
  app.post('/users/upload',auth.requiresLogin,users.upload);
  app.post('/current_location',auth.requiresLogin,users.current_location);
  
  //admin panel stuffs
  app.get('/getallUser', auth.requiresLogin, users.getallUser); // get all user for admin panel
  app.post('/admin/resendActivationLink', auth.requiresLogin, users.resendActivationLink);
  app.post('/admin/deleteUser',auth.requiresLogin,users.deleteUser);





 

}