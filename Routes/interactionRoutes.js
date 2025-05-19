const express = require('express');
const router = express.Router();
const interactionService = require('../Services/InteractionService');
const checkSession = require('../Middleware/SessionMiddleware');

router.post('/like/:id', checkSession, async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ success: false, message: 'Missing post ID' });
  }

  try {
    const result = await interactionService.likePost(req.session.user.id, postId);
    res.json(result);
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/dislike/:id', checkSession, async (req, res) => {
  const result = await interactionService.dislikePost(req.session.user.id, req.params.id);
  res.json(result);
});

router.get('/count/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const counts = await interactionService.getInteractionCounts(postId);
    res.json(counts); 
  } catch (error) {
    console.error('Error fetching interaction counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;