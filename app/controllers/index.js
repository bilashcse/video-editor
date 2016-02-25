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

exports.videoText = function(req,res){
    console.log("Text Add");
    var ffmpeg = require('fluent-ffmpeg'); 
    // ffmpeg('public/raw/input.mp4')
    // .audioCodec('libmp3lame') // Audio Codec
    // .videoCodec('libx264')  // Video Codec
    // .videoFilters({
    //     filter: 'drawtext',
    //     options: {
    //         fontfile:'public/fonts/DIN-Light.ttf',
    //         text: "Bilash & Lopa",
    //         fontsize: 20,
    //         fontcolor: '#ccc',
    //         x: '(main_w/2-text_w/2)',
    //         y: 50,
    //         //shadowcolor: 'black',
    //         //shadowx: 2,
    //         // shadowy: 2
    //     }
    // })
    // .output('public/edited/text/output.mp4')

    // .on('end', function() {
    //     console.log("Done")

    // })
    // .on('error', function(err){
    //     console.log('error: ', +err);
     
    // }).run();



    ffmpeg('public/raw/input.mp4') //Input Video File
    .output('public/edited/text/output.mp4') // Output File
    .videoFilters({ 
        filter: 'drawtext',
        options: { 
          
          text: 'THIS IS TEXT', /* etc. */ 
        } 
    })
    .audioCodec('libmp3lame') // Audio Codec
    .videoCodec('libx264')  
    .on('end', function(err) {
        if(!err)
        {

            console.log("Text Add Done");
            //res.send('Video Cropping Done');

        }

    })
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();

}




exports.cropVideo = function(req,res){
	console.log("Cropping Video");

    var ffmpeg = require('fluent-ffmpeg');  

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

    ffmpeg('public/raw/input.mp4') //Input Video File
    .output('public/edited/cropvideo/output.mp4') // Output File
    .audioCodec('libmp3lame') // Audio Codec
    .videoCodec('libx264')  // Video Codec
    .setStartTime(03) // Start Position
    .setDuration(5) // Duration
    .on('end', function(err) {
        if(!err)
        {

            console.log("Conversion Done");
            res.send('Video Cropping Done');

        }

    })
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();
}




exports.watermark = function(req,res){
    console.log("Watermark");

}

exports.videoFadein = function(req,res){

    console.log("Video Fade In");
    var ffmpeg = require('fluent-ffmpeg'); 

        ffmpeg('public/raw/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('fade=in:0:200')
        .output('public/edited/fadein/output.mp4')

        .on('end', function(err) {
            if(!err)
            {
                console.log('Effect Done');
                res.send("Successfull");
                
            }

        })
        .on('progress', function(data){
            console.log(data.percent);

        })
        .on('error', function(err){
            console.log('error: '+err);
            //callback(err);
        }).run();
}

exports.videoFadeout = function(req,res){
    console.log("Video Fade Out");
    var ffmpeg = require('fluent-ffmpeg'); 

        ffmpeg('public/raw/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('fade=out:70:10')
        .output('public/edited/fadeout/output.mp4')

        .on('end', function(err) {
            if(!err)
            {
                console.log('Effect Done');
                res.send("Successfull");
                
            }

        })
        .on('progress', function(data){
            console.log(data.percent);

        })
        .on('error', function(err){
            console.log('error: '+err);
            //callback(err);
        }).run();
}



