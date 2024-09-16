let model;
let labels;

// Function to load the TFLite model
async function loadModel() {
  try {
    model = await tflite.loadTFLiteModel('model/model_unquant.tflite');
    console.log("Model loaded successfully:", model);
  } catch (error) {
    console.error("Failed to load the TFLite model:", error);
  }
}

// Function to load labels from labels.txt
async function loadLabels() {
  try {
    const response = await fetch('model/labels.txt');
    const text = await response.text();
    labels = text.split('\n').map(label => label.trim());
    console.log("Labels loaded:", labels);
  } catch (error) {
    console.error("Failed to load labels:", error);
  }
}

// Function to classify the uploaded image
async function classifyImage() {
  // Check if the model has been loaded
  if (!model) {
    alert('The model has not been loaded yet. Please wait.');
    return;
  }

  const fileInput = document.getElementById('image-upload');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload an image!');
    return;
  }

  // Create an image element
  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (event) {
    img.src = event.target.result;
    img.onload = async function () {
      try {
        // Preprocess the image to a tensor
        const tensorImg = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();

        // Make the prediction using the model
        const prediction = await model.predict(tensorImg).data();

        // Get the highest confidence class and corresponding label
        const predictedIndex = prediction.indexOf(Math.max(...prediction));
        const predictedLabel = labels[predictedIndex];
        
        // Display the result
        document.getElementById('result').innerHTML = `Prediction: ${predictedLabel}`;
      } catch (error) {
        console.error("Error during prediction:", error);
      }
    };
  };

  reader.readAsDataURL(file);
}

// Load the model and labels when the page loads
window.onload = function() {
  loadModel();
  loadLabels();
};
