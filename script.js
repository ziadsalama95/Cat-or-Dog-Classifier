const modelURL = 'model/model.json';
const metadataURL = 'model/metadata.json';

let model;
let modelLoaded = false;

// Load the model
async function loadModel() {
    try {
        model = await tmImage.load(modelURL, metadataURL);
        modelLoaded = true;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading the model:', error);
    }
}
loadModel();

// Load and display the uploaded image, and classify it automatically
document.getElementById('imageUpload').addEventListener('change', async function(event) {
    const reader = new FileReader();
    reader.onload = async function() {
        const img = document.getElementById('uploadedImage');
        img.src = reader.result;
        img.style.display = 'block';
        
        if (modelLoaded) {
            try {
                const prediction = await model.predict(img);
                // Get the class with the highest confidence
                const maxPrediction = prediction.reduce((prev, current) => {
                    return (prev.probability > current.probability) ? prev : current;
                });
                // Display the classification result
                document.getElementById('result').innerHTML = `Prediction: ${maxPrediction.className}`;
            } catch (error) {
                console.error('Error classifying the image:', error);
            }
        } else {
            alert("Model is still loading. Please wait...");
        }
    };
    reader.readAsDataURL(event.target.files[0]);
});
