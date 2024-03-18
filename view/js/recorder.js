
    // JavaScript code
    window.addEventListener('DOMContentLoaded', () => {
        const recordButton = document.querySelector('.mic');
        const recordingsList = document.querySelector('.recordings-list');
  
        let mediaRecorder; // MediaRecorder object
        let chunks = []; // Recorded audio chunks
  
        // Start recording when the record button is clicked
        recordButton.addEventListener('click', async () => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            // recordButton.textContent = '▶ Start Recording';
                const newWidth = '130px';
                const newHeight = '130px';
                const newColorMic = '#554386';
  
                document.documentElement.style.setProperty('--box-width', newWidth);
                document.documentElement.style.setProperty('--box-height', newHeight);
                document.documentElement.style.setProperty('--color-mic', newColorMic);
  
          } else {
            await navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
  
                mediaRecorder.addEventListener('dataavailable', e => {
                  chunks.push(e.data);
                });
  
                mediaRecorder.addEventListener('stop', async () => {
                      const recording = new Blob(chunks, { type: 'audio/mp3' });
                      chunks = [];
  
                      const formData = new FormData();
                      formData.append('audio', recording, 'recording.mp3');
                     
  
                      await fetch('http://localhost:3000/upload-audio', {
                          method: 'POST',
                          body: formData
                      })
                      .then(response => {
                          // Handle server response
                          console.log('Audio uploaded successfully!');
                      })
                      .catch(error => {
                          console.error('Error uploading audio:', error);
                      });
  
                      const recordingURL = URL.createObjectURL(recording);
                      const li = document.createElement('li');
                      const audio = document.createElement('audio');
  
                      audio.setAttribute('controls', '');
                      audio.src = recordingURL;
  
                      li.appendChild(audio);
                      recordingsList.appendChild(li);
                      });
  
                mediaRecorder.start();
  
                //wait for some time 
  
                // recordButton.textContent = '■ Stop Recording';
  
  
                const newWidth = '160px';
            const newHeight = '160px';
            const newColorMic = '#20ac56';
  
            document.documentElement.style.setProperty('--box-width', newWidth);
            document.documentElement.style.setProperty('--box-height', newHeight);
            document.documentElement.style.setProperty('--color-mic', newColorMic);
  
              })
          
              .catch(error => {
                console.error('Error accessing microphone:', error);
              });
          }
        });
      });