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

# How ffmpeg, NodeJs works:

- Mute Video : To disable audio you can use noAudio() method.
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
# Copyright

Copyright (c) 2016 Nazmul Hossain

# License : The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
