const imageWorker = new Worker('worker.js');

const inputImage = document.getElementById('input-image');
const originalImage = document.getElementById('original-image');
const processedImage = document.getElementById('processed-image');

inputImage.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (fileEvent) => {
      const imageDataUrl = fileEvent.target.result;
      originalImage.src = imageDataUrl;

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, img.width, img.height);
        
        // Send the image data to the worker for processing
        imageWorker.postMessage({ imageData });
      };
    };

    reader.readAsDataURL(selectedFile);
  }
});

// Receive processed image data from the worker
imageWorker.onmessage = (event) => {
  const processedImageData = event.data;

  const processedImageCanvas = document.createElement('canvas');
  const processedImageContext = processedImageCanvas.getContext('2d');
  processedImageCanvas.width = processedImageData.width;
  processedImageCanvas.height = processedImageData.height;
  processedImageContext.putImageData(processedImageData, 0, 0);

  processedImage.src = processedImageCanvas.toDataURL();
};
