const productInput = document.getElementById('productInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', searchProduct);
productInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProduct();
    }
});

async function searchProduct() {
    const query = productInput.value.trim();

    if (!query) {
        showError('Please enter a product name');
        return;
    }

    loading.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    try {
        // Using CORS proxy to access UPCitemdb API
        const apiUrl = `https://api.upcitemdb.com/prod/trial/lookup?s=${encodeURIComponent(query)}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

        const response = await fetch(proxyUrl);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.items && data.items.length > 0) {
            displayResults(data.items);
        } else {
            showError('No products found. Try a different search term.');
        }
    } catch (error) {
        loading.classList.add('hidden');
        showError('Error fetching data. Please try again later.');
        console.error('Error:', error);
    }
}

function displayResults(items) {
    resultsDiv.innerHTML = '';

    items.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            ${item.images && item.images.length > 0 ? `<img src="${item.images[0]}" alt="${item.title}" />` : ''}
            <div class="product-info">
                <h3>${item.title || 'Unknown Product'}</h3>
                <p class="upc"><strong>UPC:</strong> ${item.upc || item.ean || 'N/A'}</p>
                ${item.brand ? `<p><strong>Brand:</strong> ${item.brand}</p>` : ''}
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
            </div>
        `;

        resultsDiv.appendChild(productCard);
    });
}

function showError(message) {
    resultsDiv.innerHTML = `<div class="error">${message}</div>`;
}
