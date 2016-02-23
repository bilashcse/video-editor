var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , async = require('async')
  , request = require('request')
  , fs = require('fs')
  , ffmpeg = require('fluent-ffmpeg');

exports.render = function(req, res){
	
	var env = process.env.NODE_ENV || 'production';

	res.render('index');


} 

exports.muteAudio = function(req,res){

	console.log("Mute Audio");
	

	var url = 'public/edited/noaudio/output.mp4';
    fs.exists(url, function(exists)
	{
	    if (exists)
	    {
	        fs.unlink(url,function(err,data){
	            if(!err){
	            	console.log("Existing File Deleted . . . ");
	            }
	        });
	    }
	});

    ffmpeg('public/raw/test.mp4') //Input Video File
    .output('public/edited/noaudio/output.mp4') // Output File
    .noAudio().videoCodec('copy')
    .on('end', function(err) {
        if(!err)
        {

            console.log("Conversion Done");
            res.send('Remove Audio is Done');

        }

    })
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();
}


exports.removeVideo = function(req,res){
	console.log("Remove Video");
	var url = 'public/edited/removevideo/output.mp3';
    fs.exists(url, function(exists)
	{
	    if (exists)
	    {
	        fs.unlink(url,function(err,data){
	            if(!err){
	            	console.log("Existing File Deleted . . . ");
	            }
	        });
	    }
	});
    ffmpeg('public/raw/test.mp4')  // Input Video File
    .output('public/edited/removevideo/output.mp3') // Output  File
    .on('end', function(err) {
        if(!err)
        {
        	console.log("Remove video is done");
            res.send('Remove Video is Done');

        }

    })
    .on('error', function(err){
        console.log('error: '+err);
    }).run();

}


exports.cropVideo = function(req,res){
	console.log("Cropping Video");
	var url = 'public/edited/cropvideo/output.mp4';
    fs.exists(url, function(exists)
	{
	    if (exists)
	    {
	        fs.unlink(url,function(err,data){
	            if(!err){
	            	console.log("Existing File Deleted . . . ");
	            }
	        });
	    }
	});

	ffmpeg('public/raw/test.mp4')
    .setStartTime(2)
    .setDuration(3)
    .output('public/edited/cropvideo/output.mp4')

    .on('end', function(err) {   
        if(!err)
        {
          console.log('conversion Done');


        }                 

    })
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();


}

