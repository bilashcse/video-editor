
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
  	
	req.session.redirectUrl=null;
    return res.redirect('/?not_found=requiresLogin&path='+req.path);
    //return res.redirect('/',{error: 'requiresLogin', path: req.path});
    
  }
  next()
};

