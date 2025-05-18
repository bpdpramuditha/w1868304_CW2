const express = require('express');
const router = express.Router();
const profileService = require('../Services/ProfileService');

router.get('/profile/:username', async (req, res) => {
  try {
    const profileData = await profileService.getProfile(req.params.username);
    res.json(profileData);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;