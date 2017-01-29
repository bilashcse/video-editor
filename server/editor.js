var express = require('express');
var promise = require("bluebird");
var bodyParser = require('body-parser');
var querystring = require('querystring');
var ffmpeg = require('fluent-ffmpeg');  
var probe = require('node-ffprobe');
var fs = require('fs');
var url = require('url');

var router = express.Router();

module.exports = function (app) {
    app.use('/editor', router);
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



router.get('/', function(req,res){
	console.log("<<<-----------------  Online video editor  ----------------->>>>");
});



router.get('/mute-audio',function(req,res){
	console.log("Mute Audio");
	// var ffmpeg = require('fluent-ffmpeg');	

	var url = 'videos/output.mp4';
	fs.exists(url, function(exists)
	{
		if (exists)
		{
			fs.unlink(url,function(err,data){
				if(!err)
					console.log("Existing File Deleted . . . ");
			});
		}
	});

    ffmpeg('videos/input.mp4') //Input Video File
    .output('videos/output.mp4') // Output File
    .noAudio().videoCodec('copy')
    .on('end', function(err) {
        if(err)
            console.log(err)
    	else if(!err)
    	{

    		console.log("Conversion Done");
    		res.send('Remove Audio is Done');

    	}

    })
    .on('error', function(err){
    	console.log('error: ', +err);

    }).run();
});


router.get('/remove-video',function(req,res){
	console.log("Remove Video");

	// var ffmpeg = require('fluent-ffmpeg'); 
	var url = 'videos/output.mp3';
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
    ffmpeg('videos/input.mp4')  // Input Video File
    .output('videos/output.mp3') // Output  File
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

});

router.get('/thumbnail',function(req,res){
	console.log("Thumbnail");
	// var ffmpeg = require('fluent-ffmpeg'); 
	//var probe = require('node-ffprobe');

	probe('videos/input.mp4', function(err, probeData) 
	{

		var proc = new ffmpeg('videos/input.mp4');

		proc.screenshots({
			timestamps: ['50%','80%'],
			folder: 'videos',
			size: '392x220'
		}).on('end', function() {
			console.log('Screenshots taken');
		});

	});
});


/* ----- Done -----*/
router.get('/video-info',function(req,res){

	console.log("Video MetaData Information");
	//var ffmpeg = require('fluent-ffmpeg'); 

	ffmpeg.ffprobe('videos/input.mp4', function(err, metadata) {
		if(err){
			console.log("MetaData not Found. "+err);
		}
		else{
			res.send(metadata);
		}
	});

});

router.get('/video-subtitle',function(req,res){
	console.log("Text Add");
	//var ffmpeg = require('fluent-ffmpeg'); 
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
    		fontfile: 'Lucida Grande.ttf',
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

});



router.get('/video-crop',function(req,res){
	console.log("Cropping Video");

	//var ffmpeg = require('fluent-ffmpeg');  

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
});



router.get('/watermark',function(req,res){

	console.log("Watermark");

	//var ffmpeg = require('fluent-ffmpeg'); 
	ffmpeg('public/raw/input.mp4')
                    .audioCodec('libmp3lame') // Audio Codec
                    .videoCodec('libx264') 
                    .videoFilters({
                    	filter: 'drawtext',
                    	options: {
                    		fontfile:'public/fonts/DIN-Light.ttf',
                    		text: 'hghj jhj hjgj gj g ',
                            // fontsize: req.body.font,
                            // fontcolor: req.body.color,
                            x: '(main_w/2-text_w/2)',
                            y: 50,
                            //shadowcolor: 'black',
                            //shadowx: 2,
                            // shadowy: 2
                        }
                    })
                    .output('public/edited/text/test.mp4')

                    .on('end', function(err) {
                    	if(!err)
                    	{
                    		console.log('Title Save');
                            //res.send('videos/effect/test.mp4')

                        }

                    })
                    .on('error', function(err){
                    	console.log('error: ', +err);
                        //callback(err);
                    }).run();



                });


router.get('/effect-fadein',function(req,res){

	console.log("Video Fade In");
	//var ffmpeg = require('fluent-ffmpeg'); 

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
    });

router.get('/effect-fadeout',function(req,res){

	console.log("Video Fade Out");
	//var ffmpeg = require('fluent-ffmpeg'); 

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
    });

router.get('/effect-blur',function(req,res){
	console.log("Video Blur");
	//var ffmpeg = require('fluent-ffmpeg'); 

	ffmpeg('public/raw/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('unsharp=7:7:-2:7:7:-2')
        .output('public/edited/blur/output.mp4')

        .on('end', function(err) {
        	if(!err)
        	{
        		console.log('Effect Blur Done');
        		res.send("Successfull");

        	}

        })
        .on('progress', function(data){
        	console.log(Math.floor(data.percent)+" %");

        })
        .on('error', function(err){
        	console.log('error: '+err);
            //callback(err);
        }).run();
    });

router.get('/effect-sharpen',function(req,res){

	console.log("Video Sharpen");
	//var ffmpeg = require('fluent-ffmpeg'); 

	ffmpeg('public/raw/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('unsharp=7:7:-2:7:7:-2')
        .output('public/edited/sharpen/output.mp4')

        .on('end', function(err) {
        	if(!err)
        	{
        		console.log('Effect Sharpen Done');
        		res.send("Successfull");

        	}

        })
        .on('progress', function(data){
        	console.log(Math.floor(data.percent)+" %");

        })
        .on('error', function(err){
        	console.log('error: '+err);
            //callback(err);
        }).run();
    });