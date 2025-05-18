const express = require('express');
const router = express.Router();
const UserService = require('../Services/UserService');
const APIKeyService = require('../Services/APIKeyService');
const checkSession = require('../Middleware/SessionMiddleware');

router.post('/registerUser', async (req, res) => {
  const userService = new UserService();
  const result = await userService.create(req);
  res.json(result);
});

router.post('/login', async (req, res) => {
  const userService = new UserService();
  const result = await userService.authenticate(req);
  res.json(result);
});

router.post('/generateApiKey', checkSession, async (req, res) => {
  const apiKeyService = new APIKeyService();
  const result = await apiKeyService.createAPIKey(req.session.user.id);
  res.json(result);
});

router.post('/logout', checkSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("user_id");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

router.get('/sessionUser', checkSession, (req, res) => {
  res.json({ username: req.session.user.username });
});

module.exports = router;