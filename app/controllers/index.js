var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , async = require('async')
  , request = require('request')
  , fs = require('fs');

exports.render = function(req, res){
	
	var env = process.env.NODE_ENV || 'production';

	res.render('index');


} 

exports.muteAudio = function(req,res){

	console.log("Mute Audio");
    var ffmpeg = require('fluent-ffmpeg');	

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

    var ffmpeg = require('fluent-ffmpeg'); 
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


exports.videoThumbnail = function(req,res){
    console.log("Thumbnail");
    var ffmpeg = require('fluent-ffmpeg'); 
    var probe = require('node-ffprobe');

    probe('public/raw/test.mp4', function(err, probeData) 
    {

        var proc = new ffmpeg('public/raw/test.mp4');

        proc.screenshots({
            timestamps: ['50%','80%'],
            folder: 'public/edited/thumbnail/output',
            size: '392x220'
        }).on('end', function() {
           console.log('Screenshots taken');
        });

    });
}




exports.cropVideo = function(req,res){
	console.log("Cropping Video");

    var ffmpeg = require('fluent-ffmpeg');
    ffmpeg('public/raw/test.mp4')
    .setStartTime(03)
    .setDuration(10)
    .output('public/output.mp4')

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




exports.watermark = function(req,res){
    console.log("Watermark");

}

exports.videoInformation = function(req,res){

    console.log("Video MetaData Information");
    var ffmpeg = require('fluent-ffmpeg'); 
    
    ffmpeg.ffprobe('public/raw/test.mp4', function(err, metadata) {
       if(err){
        console.log("MetaData not Found. "+err);
       }
       else{
        console.log(metadata)
       }
    });

}

