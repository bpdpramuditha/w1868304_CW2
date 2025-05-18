const express = require('express');
const router = express.Router();
const blogPostService = require('../Services/BlogPostService');
const checkSession = require('../Middleware/SessionMiddleware');

router.post('/createBlog', checkSession, async (req, res) => {
  const { title, content, country, date_of_visit } = req.body;
  const response = await blogPostService.createPost(req.session.user.id, title, content, country, date_of_visit);
  res.json(response);
});

router.get('/feed', async (req, res) => {
  const posts = await blogPostService.getAllPosts();
  res.json(posts);
});

router.get('/feed/:id', async (req, res) => {
  const response = await blogPostService.getPostById(req.params.id);
  res.status(response.success ? 200 : 404).json(response);
});

router.put('/updateBlog/:id', checkSession, async (req, res) => {
  const { title, content, country, date_of_visit } = req.body;
  const response = await blogPostService.updatePost(req.params.id, req.session.user.id, title, content, country, date_of_visit);
  res.status(response.success ? 200 : 403).json(response);
});

router.delete('/deleteBlog/:id', checkSession, async (req, res) => {
  const response = await blogPostService.deletePost(req.params.id);
  res.status(response.success ? 200 : 403).json(response);
});

module.exports = router;