
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://localhost/video_editor',
    root: rootPath,
    app: {
      name: 'video_editor'
    },
    facebook: {
      clientID: "290578804422991",
      clientSecret: "6dbc3aca2824a29d1bd1f38caf5cd9be",
      callbackURL: "http://localhost/auth/facebook/callback"
    },
    linkedIn: {
      clientID: "test",
      clientSecret: "test",
      callbackURL: "http://localhost/auth/linkedin/callback"
    },
     google: {
        "clientID": "test",
        "clientSecret": "test",
        "callbackURL": "http://localhost/auth/google/callback"
    },
    twitter: {
     clientID: "test",
     clientSecret: "test",
     callbackURL: "http://localhost/auth/twitter/callback"
   }

    
   
  },
  production: {
    db: 'mongodb://localhost/video_editor',
    root: rootPath,
    app: {
      name: 'video_editor'
    },
    facebook: {
     clientID: "585301341523051",
     clientSecret: "fb7c09f6a3bf0e8a5f33170cd969090f",
     callbackURL: "http://ec2-52-10-141-239.us-west-2.compute.amazonaws.com/auth/facebook/callback"
   },
   linkedIn: {
      clientID: "test",
      clientSecret: "test",
      callbackURL: "http://ec2-52-10-141-239.us-west-2.compute.amazonaws.com/auth/linkedin/callback"
    },
     google: {
        "clientID": "test",
        "clientSecret": "test",
        "callbackURL": "http://ec2-52-10-141-239.us-west-2.compute.amazonaws.com/auth/google/callback"
    },
    twitter: {
     clientID: "test",
     clientSecret: "test",
     callbackURL: "http://ec2-52-10-141-239.us-west-2.compute.amazonaws.com/auth/twitter/callback"
   }
    
  }
  
}
