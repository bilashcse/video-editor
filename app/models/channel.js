var mongoose = require('mongoose');

require( __dirname + '/users.js');

var channel_schema = mongoose.Schema({

	User:  {type: mongoose.Schema.ObjectId, ref: 'user_schema'},
	ChannelName: {type: String},
	CustomizedURL: {type: String, unique:true},
	Private: Boolean
	});

mongoose.model('Channel',channel_schema);