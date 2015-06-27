var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , fs = require('fs')
  , password_generator=require('password-generator')
  , nodemailer = require('nodemailer')
  , http = require('http')
  , _ = require("underscore");

var satelize = require('satelize');
var Forecast = require('forecast');
// var redis = require("redis");
// var client = redis.createClient();

var env = process.env.NODE_ENV || 'production';

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'airvuz@gmail.com',
        pass: 'hello12345678'
    }
});

var forecast = new Forecast({
  service: 'forecast.io',
  key: '8c85e91a77f4eb5de168037dbf4c9d80',
    units: 'farenhight', // Only the first letter is parsed
    cache: true,      // Cache API requests?
    ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
      minutes: 27,
      seconds: 45
    }
});



//creating user
exports.create = function(req,res){
  
    User.find({ $or: [{'email':req.body.email},{'user_name': req.body.user_name}] }).exec(function(err,user){
    
     //console.log(req.body);
     // console.log(user);
    if(user.length>0)
    {
      res.send('already exist');
    }
    else
    {
      res.send('ok');
      var user=new User({email: req.body.email});
      
      if(req.body.first_name){
        user.first_name=req.body.first_name;
      }

      if(req.body.last_name){
        user.last_name = req.body.last_name;
      }
      user.user_name = req.body.user_name;
      // user.validCode = req.body.password;
      // user.setPassword(req.body.password);
      user.loginCount=0;
      user.save(function (err)
      {
        if (err) // TODO handle the error
        {
          console.log("error in insertion "+err);
          res.redirect('/');
        }
        else
        {
          var server_url;
          if(env=='production'){
            server_url = 'http://52.26.2.139/'
          }
          else{
            server_url = 'http://localhost/'
          }
          var confirm_email_url = server_url + 'confirm_email' + '?user_id=' + user._id;
          console.log(confirm_email_url);

        var mailOptions = {
            from: 'support@sift.com', // sender address 
            to: req.body.email, // list of receivers 
            subject: 'Registration', // Subject line 
            text: 'Please Cofirm your email by clicking the link', // plaintext body 
            html: "<a href=" + confirm_email_url + ">"+ confirm_email_url + "</a>" // html body 
        };
         
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);


            }
        });


      }

    });
  }
  
  });
  
  
};

// Searching Elements
exports.search_music = function (req, res) {
          //var search_item="love"; 
            var search_item=req.body.value;
            var itunes=require('itunes-search');
            var options = {
            media: "music" 
            , limit: 20
            }
             
            itunes.search(search_item, options,
            function(response) {
            for(var i=0; i <= response.results.length-1; i++)
            {
            var resu = response.results[i];
            console.log(resu['trackName']);

            }

 
              /*res.render ('search',{
              data : resu['trackName']
             })*/

 
              console.log(req.body)
              res.send(response.results)

            });   


         }


///users login
exports.session = function (req, res) {


  User.findOne({_id:req.user._id}).exec(function(err,user){
    if(err)
      console.log(err);
    else if(user)
    {
        var date = new Date();
        user.lastLogin=date;

        user.save(function(err){
            if(err)
              console.log('Error');
            else
            {

                var current_hour = date.getHours();
                var current_min = date.getMinutes();
                req.session.hour=current_hour;
                req.session.minute=current_min;
                var url=req.session.redirectUrl || '/';
                req.session.redirectUrl=null;
                res.redirect(url);
            }
        });
    }
  });

  
}

exports.signout = function (req, res) {
  // User.findOne({_id:req.user._id}).exec(function(err,user){
  //   if(err)
  //     console.log(err);
  //   else{
  //     //console.log(user);
  //     user.loginCount=1;
  //     user.save(function(err){

  //           if(err)
  //             console.log(err);
  //           else{
  //             req.logout();
  //             res.redirect('/');
  //           }
          
  //       })
      
  //   }
  // })
  req.logout();
  res.redirect('/');
}


exports.authCallback = function (req, res, next) {

  
  console.log(req.user._id);
  User.findOne({_id:req.user._id}).exec(function(err,user)
  {
      if(err)
        console.log(err)
      else if(user)
      {
          var date=new Date();
          user.lastLogin = date;

          user.save(function(err){
                if(err)
                  console.log('Error');
                else
                {
                  var url=req.session.redirectUrl || '/';
                  req.session.redirectUrl=null;
                  res.redirect(url);
                }
            });
      }

  });

}

exports.success = function (req, res) {

  var query=User.findOne({_id: req.user._id});

  query.exec(function(err,user){
    if(err || !user)
    {
      req.logout();
      res.redirect('/?info=unexpectedEvent');
    }
    else
    {


      res.render('users/home', {
        title: 'home',
        user: user,
    
      });
   
    }

  });
  
}

exports.confirm_email = function(req,res){
  
    var user_id = req.param('user_id');
    User.findOne({'_id': user_id}).select("email password emailConfirmed").exec(function(err,user){
      if(!err && user){
        if(user.emailConfirmed!=true){
          user.emailConfirmed = true;
          user.save(function(err){
            if(err){
              console.log(err);
            }
          })
        }
        // res.redirect('/confirmActivation');
        req.logIn(user, function(err) {

          if (err) return next(err);
            res.redirect('/confirmActivation');
             
        });

  
      }
    })

}

exports.confirm_activation = function(req,res){

  res.render('confirmActivation');
}

exports.waitingConfirmation = function(req,res){
  res.render('waitingConfirmationScreen');
}

exports.recoverPassword = function(req,res){

  var email = req.body.email;

  User.findOne({'email' : email}).exec(function(err,user){
    if(!err){
      if(!user){
        res.send('no account exist');
      }
      else{

        var mailOptions = {
            from: 'hello@airvuz.com', // sender address 
            to: req.body.email, // list of receivers 
            subject: 'recover password', // Subject line 
            text: 'Yor password is ' + user.validCode, // plaintext body 
            // html: '<a>'+ confirm_email_url + '</a>' // html body 
        };
         
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
                res.send('ok');

            }
        });

      }
    }
  })
}

exports.getallUser = function(req,res){

  User.find().lean().exec(function(err,user){
    if(!err){
      res.send(user);
    }
  })
}

exports.resendActivationLink=function(req,res){

  var user_id = req.body.user_id;

  User.findOne({'_id' : user_id}).exec(function(err,user){

    if(!err && user){

      var server_url;
      if(env=='production'){
          server_url = 'http://52.10.141.239/'
      }
      else{
        server_url = 'http://localhost/'
      }
      var confirm_email_url = server_url + 'confirm_email' + '?user_id=' + user._id;
      console.log(confirm_email_url);

      var mailOptions = {
          from: 'hello@sift.com', // sender address 
          to: user.email, // list of receivers 
          subject: 'activation link', // Subject line 
          text: 'Please Cofirm your email by clicking the link', // plaintext body 
          html: "<a href='confirm_email_url'>"+ confirm_email_url + "</a>" // html body 
      };
       
      // send mail with defined transport object 
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
          }else{
              res.send('ok');

          }
      });

    }
    else{
      res.send('error');
    }
  })
}

exports.deleteUser = function(req,res){

  res.send('ok');
  var user_id = req.body.user_id;

  User.remove({'_id' : user_id}).exec(function(err){
    if(err){
      console.log(err);
    }
  })
}

exports.setPassword = function(req,res){

  User.findOne({'_id': req.user._id}).exec(function(err,user){
    if(!err && user){
      user.setPassword(req.body.password);
      user.validCode = req.body.password;
      user.save(function(err){
        if(err)
          console.log(err);
        else
          res.send('ok');
      })
    }
  })
}

exports.getTimeForecast = function(req,res){

  User.findOne({'_id' : req.user._id}).exec(function(err,user){
    if(!err && user){
        var loc = [];
        loc.push(user.loc[1]);
        loc.push(user.loc[0]);
        console.log(loc);
        // console.log(object);
        // Retrieve weather information, ignoring the cache
        forecast.get(loc, true, function(err, weather) {
          
          if(!err && weather){
            // console.log(weather);

            res.send({time: weather.currently.time,summary:weather.currently.summary,temperature:weather.currently.temperature});

          }
          else{
            res.send('error');
          }
          
        });
    }
  })
}

exports.editProfile = function(req,res){

  var data = req.body;
  var email_exist = false;
  var user_name_exist = false;
 

  User.find({ $or: [{'email':req.body.email},{'user_name': req.body.user_name}] }).select("email user_name").exec(function(err,alluser){

    if(!err && alluser){
      
      for(var i=0;i<alluser.length;i++){
        if(alluser[i]._id != req.user._id && alluser[i].user_name==req.body.user_name){

          user_name_exist = true;

        }
        if(alluser[i]._id != req.user._id && alluser[i].email==req.body.email){

          email_exist = true;

        }
      }

      if(email_exist || user_name_exist){
        res.send({'user_name_exist' : user_name_exist, 'email_exist' : email_exist});
      }
      else{
        User.findOne({'_id' : req.user._id}).exec(function(err,user){
          if(!err && user){

            res.send('ok');
            for(var prop in req.body){
              user[prop] = req.body[prop];
              user.save(function(err){
                if(err)
                  console.log(err);
                
              })

              if(req.files.file){

                var file = req.files.file;

                fs.readFile(file.path,function(err,data){
                  fs.writeFile('public/userProfilePictures/' + file.name,data,function(err){
                    if(err)
                      throw err;
                    else{

                      user.profile_picture = '/userProfilePictures/' + file.name;
                      user.save(function(err){
                        if(err)
                          console.log(err);
                          // fs.unlink(file.path, function (err){
                          //   if (err)
                          //     throw err;
                          // })
                      })

                    }
                               
                  })
                })
                  
              }


              if(req.files.cover_image){

                var file = req.files.cover_image;

                console.log(file.path);

                fs.readFile(file.path,function(err,data){
                  fs.writeFile('public/userCoverPictures/' + file.name,data,function(err){
                    if(err)
                      throw err;
                    else{

                      user.cover_picture = '/userCoverPictures/' + file.name;
                      user.save(function(err){
                        if(err)
                          console.log(err);
                          // fs.unlink(file.path, function (err){
                          //   if (err)
                          //     throw err;
                          // })
                      })

                    }
                               
                  })
                })
                  
              }
            }
          }
        })

      }
    }
  })


}

exports.upload = function(req,res){
    if(req.files.file){
      var file = req.files.file;

      fs.readFile(file.path,function(err,data){
      fs.writeFile('public/videos/' + file.name,data,function(err){
      if(err)
          throw err;
        else{
            res.send('ok');
          }
                               
        })
      })
    }
  }

  

exports.current_location=function(req,res){
  // console.log(req.body);
  var location=req.body;
  User.findOne({_id: req.user._id}).select("loc").exec(function(err,user){
    if(!err && user)
    {
      // user.current_location=location;
      lat=parseFloat(location.latitude);
      lng=parseFloat(location.longitude);
      user.loc=[];
      user.loc.push(lng);
      user.loc.push(lat);
      user.save(function(err){
        if(err)
        {
          console.log(err);
          res.send('error');
        }  
        else
        {
          var address_component = '';
          var options = {
            host: 'maps.googleapis.com',
            port: 80,
            path: '/maps/api/geocode/json?address='+location.latitude+','+location.longitude,
            method: 'GET'
          };
          var req = http.request(options, function(response) {
              response.setEncoding('utf8');
              var out = '';
              response.on('data', function (chunk) {
                out += chunk;
                //console.log('BODY: ' + out);
            });
            response.on('end', function() {
              var obj = JSON.parse(out);
              address_component += obj.results[1].address_components[0].short_name+', '+obj.results[1].address_components[3].short_name;
              res.send({loc: user.loc, address: address_component});  
            });
          });

          req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
          });

          req.end();
        }
      })
    }
    else
    {
      if(err)
        console.log(err);
      res.send('error');
    }
  })

  
}


// Sift Content :

exports.messageSend = function(req,res){

  console.log("Sift Message:");


    var mailOptions = {
        from: req.body.messageEmail, // sender address 
        to: 'isiftcontent@gmail.com', // list of receivers 
        subject: 'Message', // Subject line 
        
        html: "Name : "+req.body.messageName+"Message : "+req.body.message // html body 
        
    };
     
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
            res.redirect('/');


        }
    });
}
