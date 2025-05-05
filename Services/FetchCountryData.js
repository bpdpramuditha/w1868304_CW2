const axios = require('axios');

class FetchCountryData {
    async getCountryData(country) {
        try {
            const encodedCountry = encodeURIComponent(country.trim());
            const response = await axios.get(`https://restcountries.com/v3.1/name/${encodedCountry}`);
            const countryData = response.data[0];

            return {
                name: countryData.name.common,
                capital: countryData.capital ? countryData.capital[0] : 'N/A',
                currency: countryData.currencies ? Object.keys(countryData.currencies)[0] : 'N/A',
                languages: countryData.languages ? Object.values(countryData.languages) : [],
                flag: countryData.flags.svg
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

module.exports = FetchCountryData;
