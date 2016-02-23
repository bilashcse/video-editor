
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://127.0.0.1/lootbet',
    root: rootPath,
    app: {
      name: 'lootbet'
    },
    facebook: {
      clientID: "290549740971971",
      clientSecret: "4b188657132eba3a6b391a7c6ceeffc6",
      callbackURL: "http://airvuz.com/auth/facebook/callback"
    },
     twitter: {
     clientID: "NriwXWU7qTx47bsxlexZLg6aJ",
     clientSecret: "Y65uFqPE2oT2xE9wMxbbPGXXkGmJlhrYSGMGYcQy7JsiUBC7hQ",
     callbackURL: "http://localhost/auth/twitter/callback"
   }

    
   
  },
  production: {
    db: 'mongodb://127.0.0.1/lootbet',
    root: rootPath,
    app: {
      name: 'lootbet'
    },
    facebook: {
     clientID: "290549740971971",
     clientSecret: "4b188657132eba3a6b391a7c6ceeffc6",
     callbackURL: "http://airvuz.com/auth/facebook/callback"
     //http://beta.airvuz.com/auth/facebook/callback
   },
     twitter: {
     clientID: "NriwXWU7qTx47bsxlexZLg6aJ",
     clientSecret: "Y65uFqPE2oT2xE9wMxbbPGXXkGmJlhrYSGMGYcQy7JsiUBC7hQ",
     callbackURL: "http://localhost/auth/twitter/callback"
   }
    
  }
  
}
