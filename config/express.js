/**
 * Module dependencies.
 */

var express = require('express')

  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , helpers = require('view-helpers')

module.exports = function (app,config,passport) {

  app.set('showStackError', true)
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  // don't use logger for test env
  
    app.use(express.logger('dev'))
  

  // set views path, template engine and default layout
  app.engine('.html', require('ejs').__express);
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'html')

  
  // enable jsonp
  app.enable("jsonp callback")

  app.configure(function () {
    // dynamic helpers
    app.use(helpers(config.app.name))

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    

    // express/mongo session storage
    app.use(express.session({
      secret: 'podhop',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }));
    

    app.use(flash())

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())


    app.use(app.router)


    app.use(function(req, res, next){
      //console.log(req.user);
      if(!req.user)
        res.status(404).render('index', { url: req.originalUrl, error: 'Not found' });
      else
        res.redirect('/');
    })
    

  })
}
