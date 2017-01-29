# API based Online Video Editor


NodeJs, AngularJs & FFMPEG based web video editor. I have showing the backend logic for editing video. Actually when someone try to edit video using NodeJs, ffmpeg, he cant think how to start & how he can do it. So I have implemented this video editor with very simple logic with ffmpeg. All resource are together here & anybody can start from here. If someone analysis these codes, he can understand the basic for video editor<br>


# Feature Implemented :
- Mute a Video
- Remove Video & save Only audio.
- Showing Video Metadata.
- Genarate Thumbnail.
- Cropping Video
- Effect : Fadein, Fadeout,Blur, Sharpen.

# Working on :
- Watermark
- More Video Effects
- Add new sound
- Add Text

## Configure mechine:
```javascript
1. SSH into your instance and become root
sudo su -

2. Go to the the /usr/local/bin directory
cd /usr/local/bin

3. Inside the /usr/local/bin directory, create an "ffmpeg" directory
mkdir ffmpeg

4. Go into the new directory
cd ffmpeg

5. Go to static build directory at http://ffmpeg.gusari.org/static/64bit/ and pick the 
latest version of FFMPEG - as of this writing, it was ffmpeg.static.64bit.2014-02-16.tar.gz
wget http://ffmpeg.gusari.org/static/64bit/ffmpeg.static.64bit.2014-02-16.tar.gz

6. The file should now be in /usr/local/bin/ffmpeg. Untar it...
tar -xzf ffmpeg.static.64bit.2014-02-16.tar.gz

5. Run it and check what the latest version is 
./ffmpeg -version
6. If you want to be able to execute FFMPEG from any directory, simply create a symlink into /usr/bin like this:
ln -s /usr/local/bin/ffmpeg/ffmpeg /usr/bin/ffmpeg
ln -s /usr/local/bin/ffmpeg/ffprobe /usr/bin/ffprobe

The first part (/usr/local/bin/ffmpeg/ffmpeg) is where the file is located after I untarred 
the file. The second part (/usr/bin/ffmpeg) is where we want the symlink to go

```

# How ffmpeg, NodeJs works:

## Mute Video : To disable audio you can use noAudio( ) method.
```javascript
    ffmpeg('public/raw/test.mp4') //Input Video File
    .output('public/edited/noaudio/output.mp4') // Output File
    .noAudio().videoCodec('copy')
    .on('end', function(err) {
        if(!err)
        {
            console.log("Conversion Done");
        }

    });
    .on('error', function(err){
        console.log('error: ', +err);

    }).run();


```

## Remove Video & save Only audio : 
```javascript
    ffmpeg('public/raw/test.mp4')  // Input Video File
    .output('public/edited/removevideo/output.mp3') // Output  File
    .on('end', function(err) {
        if(!err)
        {
        	console.log("Remove video is done");
        }

    })
    .on('error', function(err){
        console.log('error: '+err);
    }).run();
```  

## Showing Video Metadata:
```javascript
ffmpeg.ffprobe('public/raw/test.mp4', function(err, metadata) { // Input video File
   if(err){
    console.log("MetaData not Found. "+err);
   }
   else{
    console.log(metadata)
   }
});
``` 
## Genarate Thumbnail:
```javascript
    var ffmpeg = require('fluent-ffmpeg'); 
    var probe = require('node-ffprobe');
    probe('public/raw/test.mp4', function(err, probeData) 
    {

        var proc = new ffmpeg('public/raw/test.mp4'); // Input File

        proc.screenshots({
            timestamps: ['50%','80%'],
            folder: 'public/edited/thumbnail/output', // Thumbnail Location
            size: '392x220'
        }).on('end', function() {
           console.log('Screenshots taken');
        });

    });
``` 

## Cropping Video:
```javascript
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
```

# Copyright

Copyright (c) 2016 Nazmul Hossain

# License : The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
