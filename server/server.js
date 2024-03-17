const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const port = 3000 || process.env.port;

const filePath = 'save/upload_recorder.mp3';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload-audio', upload.single('audio'), (req, res) => {
  // استقبال الملف الصوتي ومعالجته هنا
  console.log('Received audio file:', req.file.path);

        // قراءة الملف المرفوع وحفظه بالمسار المحدد
        //const audioFile = req.file;
        //const audioFile = req.body.audio;
        const audioFile =  req.file.path;

  // تحويل الملف الصوتي إلى تنسيق MP3
  ffmpeg(audioFile)
    .toFormat('mp3')
    .save(filePath)
    .on('end', () => {
      res.send('تم حفظ الملف الصوتي بتنسيق MP3 بنجاح.');
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('حدث خطأ أثناء تحويل الملف الصوتي إلى تنسيق MP3.');
    });
});


app.listen(port, () => {
  console.log(`Server listening on port  http://localhost:${port}`);
});