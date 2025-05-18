const express = require('express');
const router = express.Router();
const followService = require('../Services/FollowService');
const checkSession = require('../Middleware/SessionMiddleware');
const UserDAO = require('../DAOs/UserDAO');

router.post('/follow/:username', checkSession, async (req, res) => {
  try {
    await followService.followUser(req.session.user.username, req.params.username);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/unfollow/:username', checkSession, async (req, res) => {
  try {
    await followService.unfollowUser(req.session.user.username, req.params.username);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/isFollowing/:username', checkSession, async (req, res) => {
  try {
    const result = await followService.checkIfFollowing(req.session.user.username, req.params.username);
    res.json({ isFollowing: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/followers/:username', async (req, res) => {
  try {
    const followers = await UserDAO.getFollowers(req.params.username);
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

router.get('/following/:username', async (req, res) => {
  try {
    const following = await UserDAO.getFollowing(req.params.username);
    res.json(following);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

module.exports = router;