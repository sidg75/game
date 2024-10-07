document.addEventListener('DOMContentLoaded', () => {
    const plantImageInput = document.getElementById('plantImage');
    const uploadedImage = document.getElementById('uploadedImage');

    // Display image preview when an image is selected
    plantImageInput.addEventListener('change', (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;  // Set the image src to the uploaded image
                uploadedImage.style.display = 'block'; // Make the image visible
            };
            reader.readAsDataURL(imageFile);
        }
    });

    document.getElementById('uploadButton').addEventListener('click', () => {
        const imageFile = plantImageInput.files[0];
        if (!imageFile) {
            alert('Please select an image file');
            return;
        }

        const formData = new FormData();
        formData.append('images', imageFile);
        formData.append('organs', 'leaf');  // you can change to 'flower', 'fruit', etc.
        
        fetch('https://api.plant.id/v2/identify', {
            method: 'POST',
            headers: {
                'Api-Key': 'o6ZRL9rZ5bGW4i79eQsRdLD4vLomDtFMPv9bJEs2gFeD6W33wq'  // Replace with your actual API key
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.suggestions && data.suggestions.length > 0) {
                const plantDetails = data.suggestions[0];
                displayPlantDetails(plantDetails);
                displaySimilarPlants(plantDetails.similar_images);
            } else {
                alert('No plant could be identified. Try uploading a different image.');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function displayPlantDetails(details) {
        const resultSection = document.getElementById('result-section');
        resultSection.classList.remove('hidden');

        const tbody = document.querySelector('#plant-details tbody');
        tbody.innerHTML = `
            <tr>
                <td>Name</td>
                <td>${details.plant_name}</td>
            </tr>
            <tr>
                <td>Scientific Name</td>
                <td>${details.plant_details.scientific_name}</td>
            </tr>
            <tr>
                <td>Family</td>
                <td>${details.plant_details.family}</td>
            </tr>
            <tr>
                <td>Genus</td>
                <td>${details.plant_details.genus}</td>
            </tr>
        `;
    }

    function displaySimilarPlants(similarImages) {
        const similarPlantsDiv = document.getElementById('similar-plants');
        similarPlantsDiv.innerHTML = '';

        // Check if similarImages is defined and is an array
        if (similarImages && Array.isArray(similarImages) && similarImages.length > 0) {
            similarImages.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                similarPlantsDiv.appendChild(imgElement);
            });
        } else {
            // Display a message if no similar images are available
            similarPlantsDiv.innerHTML = '<p>No similar plants found.</p>';
        }
    }
});
