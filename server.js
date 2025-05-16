const express = require('express')
const session = require('express-session')
const UserService = require('./Services/UserService')
const APIKeyService = require('./Services/APIKeyService')
const apiKeyMiddleware = require('./Middleware/APIAuthMiddleware')
const profileService = require('./Services/ProfileService');
const  FetchCountryData = require('./Services/FetchCountryData')
const followService = require('./Services/FollowService');
const checkSession  = require('./Middleware/SessionMiddleware')
const UserDAO = require('./DAOs/UserDAO');
const blogPostService = require('./Services/BlogPostService');

const app = express()
const path = require('path')
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))



app.use(session({
    key: 'user_id',
    secret: process.env.JWT_SECRET || my_secret_key_,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true, //Do not allow javascript to modify cookie data
        sameSite: 'lax', 
        maxAge: 24*60*60*1000
    }
}))


app.post('/registerUser', async(req, res) => {
    const userService = new UserService()
    const result = await userService.create(req)
    res.json(result)
});

app.post('/login',async (req, res) =>{
    const userService = new UserService()
    const result = await userService.authenticate(req)
    res.json(result)
})

app.post('/generateApiKey', checkSession, async (req, res) => {
    const apiKeyService = new APIKeyService()
    const result = await apiKeyService.createAPIKey(req.session.user.id)
    res.json(result)
})

app.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, 'registerUser.html'));
})

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, 'userLogin.html'));
})

app.post('/logout', checkSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("user_id"); 
    return res.json({ success: true, message: "Logged out successfully" });
  });
});

app.get('/sessionUser', checkSession, (req, res) => {
  res.json({ username: req.session.user.username });
});

app.get('/country/:name', checkSession, async (req, res) => {  //add apiKeyMiddleware
    const countryName = req.params.name;
    const fetchCountryData = new FetchCountryData();
    const data = await fetchCountryData.getCountryData(countryName);
    res.json(data);
});

app.get('/profile/:username',  async (req, res) => {
  try {
    const username = req.params.username;
    const profileData = await profileService.getProfile(username);
    res.json(profileData);
  } catch (err) {
    console.error('Error in route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/follow/:username', checkSession, async (req, res) => {
  try {
    await followService.followUser(req.session.user.username, req.params.username);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/unfollow/:username', checkSession, async (req, res) => {
  try {
    await followService.unfollowUser(req.session.user.username, req.params.username);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/isFollowing/:username', checkSession, async (req, res) => {
  try {
    const result = await followService.checkIfFollowing(req.session.user.username, req.params.username);
    res.json({ isFollowing: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/followers/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const followers = await UserDAO.getFollowers(username);
    res.json(followers);
  } catch (err) {
    console.error('Error fetching followers:', err);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

app.get('/following/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const following = await UserDAO.getFollowing(username);
    res.json(following); 
  } catch (err) {
    console.error('Error fetching following:', err);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});


app.post('/createBlog', checkSession, async (req, res) => {
  const { title, content, country, date_of_visit } = req.body;
  const response = await blogPostService.createPost(req.session.user.id, title, content, country, date_of_visit);
  res.json(response);
});


app.get('/feed', async (req, res) => {
  const posts = await blogPostService.getAllPosts();
  res.json(posts);
});


app.get('/feed/:id', async (req, res) => {
  const response = await blogPostService.getPostById(req.params.id);
  res.status(response.success ? 200 : 404).json(response);
});


app.put('/updateBlog/:id', checkSession, async (req, res) => {
  const { title, content, country, date_of_visit } = req.body;
  const response = await blogPostService.updatePost(req.params.id, req.session.user.id, title, content, country, date_of_visit);
  res.status(response.success ? 200 : 403).json(response);
});


app.delete('/deleteBlog/:id', checkSession, async (req, res) => {
  const response = await blogPostService.deletePost(req.params.id, req.session.user.id);
  res.status(response.success ? 200 : 403).json(response);
});


app.listen(port, () => {
    console.log("Server is running on port", port);
});