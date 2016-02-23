
var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , User = mongoose.model('User')
  



var https = require('https');


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

      //console.log("Email & password")
      //console.log(email)
      //console.log(password)

      User.findOne({ 'email': email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {

          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.isValidPassword(password)) {
          
          return done(null, false, { message: 'Invalid password' })
        }

        //console.log(user);
        //console.log('Login User');
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
            user.user_name= profile._json.name;
            user.first_name = profile._json.first_name;
            user.last_name = profile._json.last_name;
            user.cover_picture = "https://graph.facebook.com/" + profile._json.id + "/picture" + "?width=150&height=150" + "&access_token=" + accessToken;
            //user.profile_picture = "https://graph.facebook.com/"+profile._json.id +"?fields=cover&access_token="+accessToken;

            var options = {
              host: "graph.facebook.com",
              port: 443,
              path: "/"+profile._json.id +"?fields=cover&access_token="+accessToken,
              method: "GET"
            };

            var request = https.request(options, function(response) {
            var out = '';
              response.on('data', function (chunk) {
                out += chunk;
                console.log("testing -------------------")
              });

              response.on('error', function(){

                user.loginCount++;
                user.save(function (err) {
                  if (err) console.log(err)
                  return done(err, user)
                })

              });

              response.on('end', function(){
                out = JSON.parse(out);
                if(out.cover)
                {
                  user.profile_picture = out.cover.source;
                }

                

                user.loginCount++;
                user.save(function (err) {
                  if (err) console.log(err)
                  return done(err, user)
                })

              });

            });

            console.log("Muhahahaha");

            request.end();



          }
          else {
            
            console.log('facebook')
            console.log(profile._json)
            user.facebook=profile._json;
            user.facebook_access_token=accessToken;
            user.facebook_refresh_token=refreshToken;
            //user.user_name= profile._json.name;
            //user.first_name = profile._json.first_name;
            //user.last_name = profile._json.last_name;

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

  //function


  // use twitter strategy
  passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID
      , consumerSecret: config.twitter.clientSecret
      , callbackURL: config.twitter.callbackURL
      , passReqToCallback: true
    },
    function(req,token, tokenSecret, profile, done) {
      if(!req.user)
      {

        User.findOne({ 'twitter.id_str': profile.id }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
           
          user = new User({twitter: profile._json});
          user.name=user.twitter.screen_name;
          user.loginCount++;
          user.emailConfirmed='true'
          user.twitter_access_token=token;
          user.twitter_access_token_secret=tokenSecret;
          
          user.first_name = user.twitter.name;
          user.last_name = user.twitter.screen_name;
          user.user_name = user.twitter.screen_name;
          user.place  = user.twitter.location;

          var str = user.twitter.location;
          // var newCat=str.split(",");

          // var name;
          
          // for(var i=0;i<newCat.length;i++)
          // {
          //     if(i == length)
          //         name = newCat[i];
          // }

          // user.country  = name;
          user.profile_picture = user.twitter.profile_banner_url;
          user.cover_picture = user.twitter.profile_image_url;
          
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          
            user.twitter=profile._json;
            user.twitter_access_token=token;
            user.twitter_access_token_secret=tokenSecret;
      
            user.save(function (err) {
              if (err) console.log(err)
              else
                return done(null,     user);       
            })
        }
      })
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
            user.twitter=profile._json;
            user.twitter_access_token=token;
            user.twitter_access_token_secret=tokenSecret;
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
