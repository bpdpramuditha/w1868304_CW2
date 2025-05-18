const axios = require('axios');

class FetchCountryData {
    async getCountryData(country) {
    try {
        const encodedCountry = encodeURIComponent(country.trim());
        const response = await axios.get(`https://restcountries.com/v3.1/name/${encodedCountry}`);
        const countryData = response.data[0];

        return {
            name: countryData?.name?.common || 'N/A',
            capital: countryData?.capital?.[0] || 'N/A',
            currency: countryData?.currencies ? Object.keys(countryData.currencies)[0] : 'N/A',
            languages: countryData?.languages ? Object.values(countryData.languages) : [],
            flag: countryData?.flags?.svg || countryData?.flags?.png || ''
        };
    } catch (error) {
        console.error('Error fetching country data:', error.message);
        return null;
    }
}


    async getAllCountries() {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const countryList = response.data.map(c => c.name.common).sort();
            return countryList;
        } catch (error) {
            console.error('Error fetching country list:', error.message);
            return [];
        }
    }
}

module.exports = FetchCountryData;
