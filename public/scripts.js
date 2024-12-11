// scripts.js
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const speedText = document.getElementById('speed');
    const estimatedTimeText = document.getElementById('estimatedTime');
    const progressContainer = document.getElementById('progressContainer');

    progressContainer.style.display = 'block';

    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.value = percentComplete;
            progressText.textContent = `Uploaded: ${Math.round(percentComplete)}%`;
            
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000; // in seconds
            const uploadSpeed = e.loaded / elapsedTime; // bytes per second
            speedText.textContent = `Speed: ${(uploadSpeed / 1024).toFixed(2)} KB/s`;
            
            const estimatedTimeLeft = (e.total - e.loaded) / uploadSpeed; // in seconds
            estimatedTimeText.textContent = `Estimated Time Left: ${Math.round(estimatedTimeLeft)} seconds`;
        }
    });

    const startTime = new Date().getTime();

    xhr.open('POST', '/upload');
    xhr.send(formData);

    xhr.addEventListener('load', function() {
        if (xhr.status === 200) {
            progressText.textContent = 'Upload complete!';
        } else {
            progressText.textContent = 'Upload failed!';
        }
    });
});
