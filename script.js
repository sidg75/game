const imageUpload = document.getElementById('imageUpload');
const uploadButton = document.getElementById('uploadButton');
const resultsDiv = document.getElementById('results');
const plantTable = document.getElementById('plantTable');
const imageGallery = document.getElementById('imageGallery');

// Replace with your actual Plant.id API key
const PLANT_ID_API_KEY = 'o6ZRL9rZ5bGW4i79eQsRdLD4vLomDtFMPv9bJEs2gFeD6W33wq'; 

uploadButton.addEventListener('click', () => {
    const file = imageUpload.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('api_key', PLANT_ID_API_KEY);
        formData.append('images', file);

        // Make the API request to Plant.id
        fetch('https://api.plant.id/v2/identify', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.suggestions && data.suggestions.length > 0) {
                const plantData = data.suggestions[0]; // Get the top suggestion
                displayPlantDetails(plantData);
                // You can use plantData.plant_details.scientific_name to search for more images
                // and call displayImages() to show them.
            } else {
                alert("Plant not recognized. Please try a different image.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
        }); 

    } else {
        alert("Please select an image to upload.");
    }
});

function displayPlantDetails(plantData) {
    // Clear previous results
    plantTable.innerHTML = ''; 

    // Create table rows dynamically
    const tableRows = [
        ['Common Name', plantData.plant_details.common_names ? plantData.plant_details.common_names.join(', ') : 'N/A'],
        ['Scientific Name', plantData.plant_details.scientific_name],
        ['Plant Family', plantData.plant_details.family],
        // Add more rows for other details as needed
    ];

    tableRows.forEach(row => {
        const tableRow = plantTable.insertRow();
        const cell1 = tableRow.insertCell();
        const cell2 = tableRow.insertCell();
        cell1.textContent = row[0];
        cell2.textContent = row[1];
    });

    resultsDiv.style.display = 'block'; // Show the results div
}

function displayImages(imageUrls) {
    // Clear previous images
    imageGallery.innerHTML = '';

    imageUrls.forEach(imageUrl => {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = 'Plant Image';
        imageGallery.appendChild(imgElement);
    });
}