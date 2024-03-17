


const boxElement = document.querySelector('.box');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');



function showtext(str, url = null, color = "black") {
    const debugLog = document.getElementById("debugLog");
    const recordingInProgressElement = Array.from(debugLog.children).find(element => element.textContent === "Recording in progress");
    if (recordingInProgressElement) {
        debugLog.removeChild(recordingInProgressElement);
    }
    const newDiv = document.createElement("div");
    newDiv.style.color = color;
    newDiv.appendChild(document.createTextNode(str));
    debugLog.prepend(newDiv);
}

function showrecording(url) {
    const newA = document.createElement("a");
    newA.href = url;
    newA.download = "recording.mp3";
    document.getElementById("debugLog").prepend(newA);

    const newAudio = document.createElement("audio");
    newAudio.src = url;
    newAudio.controls = true;
    document.getElementById("debugLog").prepend(newAudio);
}

function showbuttons(enabledButtons) {
    const buttons = ["start", "stop", "reset"];
    for (let buttonName of buttons) {
        if (buttonName === "start") {
            // Disable the start button unless the reset button is pressed or the page is freshly loaded
            document.getElementById("id_" + buttonName).disabled = !enabledButtons.includes(buttonName);
        } else if (buttonName === "reset") {
            // Handle reset button separately: it will only be enabled after stopping the recording
            document.getElementById("id_" + buttonName).disabled = !enabledButtons.includes(buttonName);
        } else {
            document.getElementById("id_" + buttonName).disabled = !enabledButtons.includes(buttonName);
        }
    }
}

let audioData = [];
let recorder = null;
let timerIntervalId = null;

AudioRecorder.preload("../../dist/mp3worker.js");

function setupRecorder() {
    audioData = [];
    recorder = new AudioRecorder({
        recordingGain: 1,
        encoderBitRate: 96,
        streaming: true,
        streamBufferSize: 50000,
        constraints: {
            channelCount: 1,
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true
        },
    });

    recorder.ondataavailable = (data) => {
        console.log("data", data.length);
        audioData.push(data);
    };

    recorder.onstart = () => {
        document.getElementById("debugLog").innerHTML = "";
        showtext("Recording in progress", null, "red");
        showbuttons(["stop", "pause"]);

        timerIntervalId = setInterval(() => {
            document.getElementById("id_timer").innerHTML = (recorder.time / 1000.0).toFixed(2) + "s";
        }, 100);
    };

    recorder.onstop = () => {
        let mp3Blob = new Blob(audioData, {
            type: "audio/mpeg"
        });
        let mp3BlobUrl = URL.createObjectURL(mp3Blob);
        showrecording(mp3BlobUrl);
        showbuttons(["reset"]);
        uploadFile(mp3Blob);
    };

    recorder.onerror = (error) => {
        console.log(error);
        showtext("Recording error " + String(error));
        showbuttons(["start"]);
    };
}



let isRecording = false;


function startRecording() {
 //micIcon.classList.add('recording-animation');

 clearInterval(timerIntervalId);
			
 // Clear the automatic stop timeout if it's set
 clearTimeout(stopRecordingTimeoutId);

recorder.stop();
document.getElementById("debugLog").innerHTML = "";
showbuttons([]);

 isRecording = true;
 const newWidth = '200px';
 const newHeight = '200px';
 const newColorMic = '#20ac56';

 document.documentElement.style.setProperty('--box-width', newWidth);
 document.documentElement.style.setProperty('--box-height', newHeight);
 document.documentElement.style.setProperty('--color-mic', newColorMic);
}

function stopRecording() {
 //micIcon.classList.remove('recording-animation');
 clearInterval(timerIntervalId);
			
 // Clear the automatic stop timeout if it's set
 clearTimeout(stopRecordingTimeoutId);

recorder.stop();
document.getElementById("debugLog").innerHTML = "";
showbuttons([]);

 isRecording = false;
 const newWidth = '130px';
 const newHeight = '130px';
 const newColorMic = '#554386';

 document.documentElement.style.setProperty('--box-width', newWidth);
 document.documentElement.style.setProperty('--box-height', newHeight);
 document.documentElement.style.setProperty('--color-mic', newColorMic);
}




function uploadFile(blob) {
    getMicrophoneDetails().then(microphoneLabel => {
        const formData = new FormData();
        var randomUUID = generateUUID();
        var userId = getCookie("userId");
        
        // Capture the User-Agent string
        const userAgent = navigator.userAgent;
        formData.append('userAgent', userAgent); // Append User-Agent to the formData
        formData.append('microphone', microphoneLabel); // Append microphone details to the formData

        formData.append('files', blob, userId + '_' + randomUUID + '.mp3');
        formData.append('userId', userId);

        fetch('https://researchaudiorecorder.com/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                
                const uuidDiv = document.createElement("div");
                uuidDiv.innerHTML = "Recording Identifier: ";
                const uuidSpan = document.createElement("span");
                uuidSpan.style.color = "blue";
                uuidSpan.textContent = randomUUID;
                uuidSpan.style.marginRight = "10px"; 
                uuidDiv.appendChild(uuidSpan);
                const copyButton = document.createElement("button");
                copyButton.textContent = "Copy";
                copyButton.onclick = () => copyToClipboard(randomUUID);
                uuidDiv.appendChild(copyButton);
                document.getElementById("debugLog").appendChild(uuidDiv);

            })
            .catch(error => {
                console.error('Error uploading blob:', error);
            });
    }).catch(err => {
        console.error('Error retrieving microphone details:', err);
    });
}

window.onload = function() {
    showbuttons(["start"]);
}
