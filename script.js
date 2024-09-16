let model;

async function loadModel() {
  model = await tflite.loadTFLiteModel('model/model.tflite');
  console.log("Model loaded successfully");
}

async function classifyImage() {
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
      const tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
      
      // Make the prediction
      const prediction = await model.predict(tensorImg).data();
      const classNames = ['Cat', 'Dog'];
      
      const predictedClass = prediction[0] > 0.5 ? 'Dog' : 'Cat';
      document.getElementById('result').innerHTML = `Prediction: ${predictedClass}`;
    };
  };
  
  reader.readAsDataURL(file);
}

window.onload = function() {
  loadModel();
};
