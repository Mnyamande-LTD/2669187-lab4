// 1. Corrected variable names to be consistent (camelCase)
const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');

// 2. Click Event Listener
searchBtn.addEventListener('click', () => {
    const countryName = countryInput.value.trim();
    if (countryName) {
        searchCountry(countryName);
    }
});

// 3. Enter Key Event Listener
countryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const countryName = countryInput.value.trim();
        if (countryName) {
            searchCountry(countryName);
        }
    }
});



async function searchCountry(country) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const bordersGrid = document.getElementById('bordering-countries');
    const errorDiv = document.getElementById('error-message');
    
    try {
        // Required Loading State
        spinner.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        countryInfo.innerHTML = ''; 
        bordersGrid.innerHTML = '';
        
        // API Fetching
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        if (!response.ok) throw new Error('Country not found. Please try again.');
        
        const data = await response.json();
        const countryData = data[0]; // Extracting the first object from the array

        // Update DOM - Required Pattern
        countryInfo.innerHTML = `
            <h2>${countryData.name.common}</h2>
            <p><strong>Capital:</strong> ${countryData.capital ? countryData.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${countryData.region}</p>
            <img src="${countryData.flags.svg}" alt="${countryData.name.common} flag" style="width: 200px;">
        `;

        // Check for Borders
        if (countryData.borders && countryData.borders.length > 0) {
            fetchBorders(countryData.borders);
        } else {
            bordersGrid.innerHTML = '<p>No bordering countries.</p>';
        }
        
    } catch (err) {
        // Error Handling
        errorDiv.innerText = err.message;
        errorDiv.classList.remove('hidden');
    } finally {
        // Hide Spinner
        spinner.classList.add('hidden');
    }
}



async function fetchBorders(codes) {
    const bordersGrid = document.getElementById('bordering-countries');
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}`);
        const neighborData = await response.json();

        neighborData.forEach(neighbor => {
            const neighborCard = document.createElement('div');
            neighborCard.classList.add('neighbor-card');
            neighborCard.innerHTML = `
                <img src="${neighbor.flags.svg}" alt="${neighbor.name.common}" style="width: 50px;">
                <p>${neighbor.name.common}</p>
            `;
            bordersGrid.appendChild(neighborCard);
        });
    } catch (err) {
        console.error("Error fetching borders:", err);
    }
}