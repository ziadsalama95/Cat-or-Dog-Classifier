let model;
let labels;

// Function to load the TFLite model
async function loadModel() {
  model = await tflite.loadTFLiteModel('model/model_unquant.tflite');
  console.log("Model loaded successfully");
}

// Function to load labels from labels.txt
async function loadLabels() {
  const response = await fetch('model/labels.txt');
  const text = await response.text();
  labels = text.split('\n').map(label => label.trim());
  console.log("Labels loaded:", labels);
}

// Function to classify the uploaded image
async function classifyImage() {
  const fileInput = document.getElementById('image-upload');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please upload an image!');
    return;
  }

  // Create an image element from the uploaded file
  const img = new Image();
  const reader = new FileReader();
  
  reader.onload = function (event) {
    img.src = event.target.result;
    img.onload = async function () {
      const tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
      
      // Make the prediction using the TFLite model
      const prediction = await model.predict(tensorImg).data();
      
      // Get the highest confidence class
      const predictedIndex = prediction.indexOf(Math.max(...prediction));
      const predictedLabel = labels[predictedIndex];
      
      document.getElementById('result').innerHTML = `Prediction: ${predictedLabel}`;
    };
  };
  
  reader.readAsDataURL(file);
}

// Load the model and labels when the page loads
window.onload = function() {
  loadModel();
  loadLabels();
};
