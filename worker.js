// Function to apply a grayscale filter to an image
function applyGrayscale(imageData) {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = average;
    data[i + 1] = average;
    data[i + 2] = average;
  }

  return new ImageData(data, imageData.width, imageData.height);
}
  
// Listen for messages from the main thread
self.onmessage = (event) => {
  const { imageData } = event.data;
  
  const processedImageData = applyGrayscale(imageData);

  self.postMessage(processedImageData);
};
  