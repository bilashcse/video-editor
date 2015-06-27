
var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , User = mongoose.model('User')
  , Channel = mongoose.model('Channel')


module.exports = function (passport, config,_) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function(id, done) {
    /*User.findOne({ _id: id },'_id general_info loc current_location facebook_access_token linkedIn_access_token twitter_access_token twitter_access_token_secret notifications favourite', function (err, user) {
      done(err, user)
    })*/
    done(null,{_id: id});

  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ 'email': email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {

          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.isValidPassword(password)) {
          
          return done(null, false, { message: 'Invalid password' })
        }
        //console.log(user);
        console.log('Login User');
        return done(null, user)
      })
    }
  ))
 

  
  // use facebook strategy
  passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID
      , clientSecret: config.facebook.clientSecret
      , callbackURL: config.facebook.callbackURL
      , passReqToCallback: true
    },
    function(req,accessToken, refreshToken, params, profile, done) {

      //console.log(params);
      if(!req.user)
      {
        //console.log( params);
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
          
            user = new User({
            
            facebook: profile._json     

            });
            //console.log(profile);
            if(profile._json.email)
            user.email=profile._json.email;
            user.user_name=profile._json.username;
            user.facebook_access_token=accessToken;
            user.facebook_refresh_token=refreshToken;
            user.loginCount++;
            user.save(function (err) {
              if (err) console.log(err)
                return done(err, user)
            })
          }
          else {
          
            user.facebook=profile._json;
            user.facebook_access_token=accessToken;
            user.facebook_refresh_token=refreshToken;

            user.save(function (err) {
            if (err) console.log(err)
              return done(err, user)
            })
            
          }
        });
      }
      else
      {
        User.findOne({_id: req.user._id}).exec(function(err,user){
          if(err || !user)
          {
            return done(null,false);
          }
          else
          {
            user.facebook=profile._json;
            user.facebook_access_token=accessToken;
            user.facebook_refresh_token=refreshToken;
            user.save(function (err) {
              if (err) console.log(err)
              else
              {
                return done(null,req.user)
              }
              
            })
          }
        });
        
        
      }
      
    }
  ));
}
