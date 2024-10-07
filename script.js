document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const result = document.getElementById('result');
    const plantDetails = document.getElementById('plantDetails');
    const similarPlants = document.getElementById('similarPlants');
    const uploadedImageContainer = document.getElementById('uploadedImageContainer');
    const uploadedImage = document.getElementById('uploadedImage');

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload an image.');
            return;
        }

        // Display the uploaded image
        const imageUrl = URL.createObjectURL(file);
        uploadedImage.src = imageUrl;
        uploadedImageContainer.classList.remove('hidden');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];

            // API request to plant.id
            const response = await fetch('https://api.plant.id/v2/identify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': 'o6ZRL9rZ5bGW4i79eQsRdLD4vLomDtFMPv9bJEs2gFeD6W33wq'
                },
                body: JSON.stringify({
                    images: [base64Image],
                    organs: ["leaf"]
                })
            });

            const data = await response.json();
            displayResults(data);
        };
        
        reader.readAsDataURL(file);
    });

    function displayResults(data) {
        if (data && data.suggestions.length > 0) {
            result.classList.remove('hidden');

            // Clear previous results
            plantDetails.innerHTML = `
                <tr>
                    <th>Common Name</th>
                    <th>Scientific Name</th>
                    <th>More Info</th>
                </tr>
            `;
            similarPlants.innerHTML = '';

            // Populate the table with plant details
            data.suggestions.forEach(suggestion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${suggestion.common_names ? suggestion.common_names.join(', ') : 'N/A'}</td>
                    <td>${suggestion.scientific_name}</td>
                    <td><a href="${suggestion.url}" target="_blank">More Info</a></td>
                `;
                plantDetails.appendChild(row);

                // Show similar plant images
                if (suggestion.similar_images) {
                    suggestion.similar_images.forEach(image => {
                        const imgElement = document.createElement('img');
                        imgElement.src = image.url;
                        imgElement.classList.add('similar-image');
                        similarPlants.appendChild(imgElement);
                    });
                }
            });
        } else {
            alert('No suggestions found.');
        }
    }
});
