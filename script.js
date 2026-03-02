const searchbtn = document.getElementById('search-btn');
const countryinput = document.getElementById('country-input');

searchbtn.addEventListener('click', () => {
    searchCountry(countryInput.value);
})

countryinput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryinput.value);
    }
});

async function searchCountry(countryname){
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const bordersGrid = document.getElementById('bordering-countries');
    const errorDiv = document.getElementById('error-message');

    try {
        //Loading State
        spinner.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        countryInfo.innerHTML = ''; //removes previous results
        bordersGrid.innerHTML = '';

        //API fetching
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found. Please try again.');
        
        const data = await response.json();
        const country = data[0];

        //Update DOM (Country Info)
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" style="width: 200px;">
        `;

        //Fetch Bordering Countries (If any)
        if (country.borders && country.borders.length > 0) {
            fetchBorders(country.borders);
        } else {
            bordersGrid.innerHTML = '<p>No bordering countries.</p>';
        }

        //Fetch Bordering Countries
        if (country.borders && country.borders.length > 0) {
            fetchBorders(country.borders);
        } else {
            bordersGrid.innerHTML = '<p>No bordering countries.</p>';
        }

    } catch (error) {
        errorDiv.innerText = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
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
