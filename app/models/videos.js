var mongoose = require('mongoose');

require( __dirname + '/channel.js');

var video_schema = mongoose.Schema({

	Channel:  {type: mongoose.Schema.ObjectId, ref: 'channel_schema'},
	FileName: String,
	UploadDate: {type: Date, default: Date.now},
	RecordDate: {type: Date, default: Date.now},
	VideoLocation: String,
	CameraType: String,
	DroneType: String,
	Tags: [],
	Description: String,
	Categories: [],
	AllowComments: {type: Boolean, default: true},
	AllowRatings: {type: Boolean, default: true},
	
	});

mongoose.model('Videos',video_schema);