/**
 * Module dependencies.
 */

var express = require('express')
    , mongoose = require('mongoose')
    , cors = require('cors')
    , mongoStore = require('connect-mongo')(express)
    , flash = require('connect-flash')
    , User = mongoose.model('User')
    , helpers = require('view-helpers');
// , bodyParser = require('body-parser');

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
    app.use(express.static(config.root + '/client'));

    // don't use logger for test env

    app.use(express.logger('dev'))


    // set views path, template engine and default layout
    app.engine('.html', require('ejs').__express);
    app.set('views', config.root + '/client/base')
    app.set('view engine', 'html')


    // enable jsonp
    app.enable("jsonp callback")

    app.configure(function () {
        // dynamic helpers
        app.use(helpers(config.app.name))

        // cookieParser should be above session
        app.use(express.cookieParser())

        // bodyParser should be above methodOverride
        //app.use(express.bodyParser());
        app.use(express.methodOverride());

        //app.use(express.json({limit: '500mb'}));
        //app.use(express.urlencoded({limit: '500mb'}));

        app.use(express.bodyParser({limit: '800mb'}));

        // express/mongo session storage
        app.use(express.session({
            secret: 'podhop',
            store: new mongoStore({
                url: config.db,
                collection : 'sessions'
            })
        }));


        app.use(flash())

        app.use(cors())

        // use passport session
        app.use(passport.initialize())
        app.use(passport.session())


        app.use(app.router)


        app.use(function(req, res, next){
            //console.log(req.user);
            if(!req.user)
            {
                var path = require('path');
                console.log("Path ============="+req.path);
                var pathStr = req.path;
                pathStr = pathStr.substring(1);
                console.log(pathStr)

                User.findOne({urlName : pathStr}).exec(function(err,user){
                    if(err)
                        console.log(err)
                    else if(user)
                    {

                        console.log("Got it user ============================================ ")
                        res.render('index', {
                            user: req.user? req.user : 'null',
                            profile : user,
                            message: req.flash('error'),
                            error: req.param('not_found'),
                            path: req.param('path')
                        });

                        return;

                    }
                    else
                    {

                        res.redirect('/');
                        return;
                    }
                })


            }
            else
            {
                var path = require('path');
                console.log("============="+req.path);
                // res.redirect('/');
                console.log("User Check")
                var path = require('path');
                //console.error(req.path);
                var pathStr = req.path;
                pathStr = pathStr.substring(1);
                console.log(pathStr)
                User.findOne({urlName : pathStr}).exec(function(err,user){
                    if(err)
                        console.log(err)
                    else if(user)
                    {

                        console.log("Got it")
                        //console.log(user);

                        res.render('index', {
                            user: req.user || null,
                            profile : user,
                            message: req.flash('error'),
                            error: req.param('not_found'),
                            path: req.param('path')
                        });

                        return;

                    }
                    else
                    {
                        res.redirect('/');
                    }
                })
            }
        })


    })
}
