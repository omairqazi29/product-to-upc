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
        // Using Open Food Facts API for product search
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.products && data.products.length > 0) {
            displayResults(data.products);
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

        const barcode = item.code || item._id || 'N/A';
        const productName = item.product_name || item.product_name_en || 'Unknown Product';
        const brand = item.brands || '';
        const imageUrl = item.image_url || item.image_front_url || '';

        productCard.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${productName}" />` : ''}
            <div class="product-info">
                <h3>${productName}</h3>
                <p class="upc"><strong>Barcode:</strong> ${barcode}</p>
                ${brand ? `<p><strong>Brand:</strong> ${brand}</p>` : ''}
            </div>
        `;

        resultsDiv.appendChild(productCard);
    });
}

function showError(message) {
    resultsDiv.innerHTML = `<div class="error">${message}</div>`;
}
