const express = require('express');
const router = express.Router();
const FetchCountryData = require('../Services/FetchCountryData');
const checkSession = require('../Middleware/SessionMiddleware');
const apiKeyMiddleware = require('../Middleware/APIAuthMiddleware');

router.get('/country/:name', checkSession, apiKeyMiddleware, async (req, res) => {
  const countryName = req.params.name;
  const fetchCountryData = new FetchCountryData();
  const data = await fetchCountryData.getCountryData(countryName);

  if (!data) {
    return res.status(404).json({ error: 'Country not found or API error.' });
  }
  res.json(data);
});

router.get('/countries', async (req, res) => {
  const fetchCountryData = new FetchCountryData();
  const data = await fetchCountryData.getAllCountries();
  res.json({ success: true, data });
});

module.exports = router;