/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , async = require('async')
  , request = require('request');


exports.render = function(req, res){
	
	var env = process.env.NODE_ENV || 'production';

	User.findOne({'email':'admin@sift.com'}).exec(function(err,user){
        if(user){
        }
        else{
           var user=new User({'email' : 'admin@sift.com'});
           	var pass="hello1234";
           	user.first_name = "Admin";
            user.setPassword(pass);
            user.user_type="admin";
            user.loginCount = 1;
            user.save(function(err){
            	if(err)
            		console.log(err);
            	else
            		console.log("admin created");
            })
        }
     })	
	
	if(req.user)
	{
		User.findOne({_id: req.user._id}).exec(function(err,user){
			if(err || !user)
			{
				req.logout();
				res.redirect('/?info=invalideUser');
			}
			else if(user)
			{

				if(user.emailConfirmed == true){
					console.log('ok');
					res.redirect('/home');
				}
				else{
					if(user.loginCount==1){
						res.redirect('/home');
					}
					else{
						req.logout();
						res.redirect('/waitingConfirmation');
					}
				}
			}
		});
	}
	else
	{
		if(req.param('not_found')=='requiresLogin' && req.param('path'))
			req.session.redirectUrl=req.param('path');
		
		res.render('index', {
    		user: req.user? req.user : 'null',
    		message: req.flash('error'),
    		error: req.param('not_found'),
    		path: req.param('path')

  		})
	}
	

} 

