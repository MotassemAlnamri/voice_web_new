
const boxElement = document.querySelector('.box');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');


// الحصول على مرجع لعنصر الزر وعنصر الصوت
const recordButton = document.getElementById('recordButton');
const audioElement = document.createElement('audio');

// التحقق من دعم واجهة تسجيل الصوت
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // معالجة النقرة على الزر لبدء أو إيقاف تسجيل الصوت
    recordButton.addEventListener('click', () => {
        if (startButton.textContent === 'ابدا') {
            startRecording();
        } else {
            stopRecording();
        }
    });

    // تعيين إعدادات الصوت
    const constraints = { audio: true };
    let mediaRecorder;


let isRecording = false;

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

function startRecording() {
 //micIcon.classList.add('recording-animation');
 navigator.mediaDevices.getUserMedia(constraints)
 .then(stream => {
     mediaRecorder = new MediaRecorder(stream);
     const chunks = [];
     mediaRecorder.start();

     mediaRecorder.addEventListener('dataavailable', event => {
         chunks.push(event.data);
     });

     mediaRecorder.addEventListener('stop', () => {
         const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
         audioElement.src = URL.createObjectURL(blob);
     });

     recordButton.textContent = 'توقف';
 })
 .catch(error => {
     console.error('حدث خطأ في الوصول إلى الصوت: ', error);
 });



 const newWidth = '200px';
 const newHeight = '200px';
 const newColorMic = '#20ac56';

 document.documentElement.style.setProperty('--box-width', newWidth);
 document.documentElement.style.setProperty('--box-height', newHeight);
 document.documentElement.style.setProperty('--color-mic', newColorMic);
}

function stopRecording() {
 //micIcon.classList.remove('recording-animation');
 if (mediaRecorder && mediaRecorder.state === 'recording') {

    mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        audioElement.src = URL.createObjectURL(blob);
    });
    
    mediaRecorder.stop();
    stopButton.textContent = 'توقف';



}

 isRecording = false;
 const newWidth = '130px';
 const newHeight = '130px';
 const newColorMic = '#554386';

 document.documentElement.style.setProperty('--box-width', newWidth);
 document.documentElement.style.setProperty('--box-height', newHeight);
 document.documentElement.style.setProperty('--color-mic', newColorMic);
}

} else {
    console.error('واجهة تسجيل الصوت غير مدعومة في المستعرض.');
}