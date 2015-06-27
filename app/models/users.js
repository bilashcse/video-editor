var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  ,uuid = require('node-uuid')
  
  , authTypes = ['twitter', 'facebook']

  var user_schema=mongoose.Schema({
  
    //user for password generating
    emailConfirmed: {type: Boolean, default: false},
    user_name: String,
    first_name: String,
    last_name: String,
    joining_date: {type: Date, default: Date.now},
    user_type: {type: String, default: 'general'}, //general or admin
    account_type: String, //paid or free
    email: {type: String, default: ""},
    password: {type: String, default: ""},
    validCode: {type: String, default: ""}, //password to recover
    salt: { type: String, required: true, default: uuid.v1 },
    loginCount:{type: Number, default: 0},
    facebook: {},
    facebook_access_token: String,
    facebook_refresh_token: String,
    profile_picture: String,
    cover_picture: String,
    loc: []
       
    
  })

  var hash = function(passwd, salt) {
    
  return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
  };


  user_schema.methods.setPassword = function(passwordString) {
      
      this.password = hash(passwordString, this.salt);
  };
  user_schema.methods.isValidPassword = function(passwordString) {
      return this.password === hash(passwordString, this.salt);
  };

  mongoose.model('User',user_schema);

  exports.getUserSchema = function(){
    return user_schema;
  }