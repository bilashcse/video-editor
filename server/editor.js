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

/* worked */
router.get('/mute-audio',function(req,res){

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

/* worked */
router.get('/remove-video',function(req,res){
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

/* Done */
router.get('/thumbnail',function(req,res){

	probe('videos/input.mp4', function(err, probeData) 
	{

		var proc = new ffmpeg('videos/input.mp4');

		proc.screenshots({
			timestamps: ['50%','80%'],
			folder: 'videos',
			size: '392x220'
		}).on('end', function() {
			console.log('Screenshots taken');
            res.send('Done Thumbnail');
		});

	});
});


/* ----- Done -----*/
router.get('/video-info',function(req,res){
	ffmpeg.ffprobe('videos/input.mp4', function(err, metadata) {
		if(err){
			console.log("MetaData not Found. "+err);
		}
		else{
			res.send(metadata);
		}
	});
});

/* Done */
router.get('/video-crop',function(req,res){
 
	var url = 'videos/output.mp4';
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

    ffmpeg('videos/input.mp4') //Input Video File
    .output('videos/output.mp4') // Output File
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

/* Done */
router.get('/effect-fadein',function(req,res){

	ffmpeg('videos/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('fade=in:0:200')
        .output('videos/fadein.mp4')

        .on('end', function(err) {
        	if(!err)
        		res.send("Successfull");
        })
        .on('progress', function(data){
        	console.log(data.percent);

        })
        .on('error', function(err){
        	console.log('error: '+err);
        }).run();
    });

/* Done */
router.get('/effect-fadeout',function(req,res){

	ffmpeg('videos/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('fade=out:70:10')
        .output('videos/fadeout.mp4')

        .on('end', function(err) {
        	if(!err)
        		res.send("Successfull");
        })
        .on('error', function(err){
        	console.log('error: '+err);
        }).run();
    });

/* Done */
router.get('/effect-blur',function(req,res){

	ffmpeg('videos/input.mp4')
        .audioCodec('libmp3lame') // Audio Codec
        .videoCodec('libx264')
        .videoFilters('unsharp=7:7:-2:7:7:-2')
        .output('videos/blur.mp4')

        .on('end', function(err) {
        	if(!err)
        		res.send("Successfull");
        })
        .on('progress', function(data){
        	console.log(Math.floor(data.percent)+" %");

        })
        .on('error', function(err){
        	console.log('error: '+err);
        }).run();
    });

/* Done */
router.get('/effect-sharpen',function(req,res){

	ffmpeg('videos/input.mp4')
    .audioCodec('libmp3lame') // Audio Codec
    .videoCodec('libx264')
    .videoFilters('unsharp=7:7:-2:7:7:-2')
    .output('videos/sharpen.mp4')

    .on('end', function(err) {
    	if(!err)
    		res.send("Successfull");
    })
    .on('progress', function(data){
    	console.log(Math.floor(data.percent)+" %");

    })
    .on('error', function(err){
    	console.log('error: '+err);
        //callback(err);
    }).run();
});

router.get('/video-subtitle',function(req,res){
    console.log("Text Add");
    
    ffmpeg('videos/input.mp4')
    .audioCodec('libmp3lame') // Audio Codec
    .videoCodec('libx264')  // Video Codec
    .videoFilters({
        filter: 'drawtext',
        options: {
            fontfile:'public/fonts/DINLight.ttf',
            text: "Bilash & Lopa",
            fontsize: 20,
            fontcolor: '#ccc',
            x: '(main_w/2-text_w/2)',
            y: 50,
            shadowcolor: 'black',
            shadowx: 2,
            shadowy: 2
        }
    })
    .output('videos/output.mp4')

    .on('end', function() {
        console.log("Done")

    })
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();

});

router.get('/watermark',function(req,res){

    console.log("Watermark");

    //var ffmpeg = require('fluent-ffmpeg'); 
    ffmpeg('videos/input.mp4')
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
        .output('videos/test.mp4')

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