const express = require('express')
const session = require('express-session')

const userRoutes = require('./Routes/userRoutes');
const countryRoutes = require('./Routes/countryRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const followRoutes = require('./Routes/followRoutes');
const blogRoutes = require('./Routes/blogRoutes');

const app = express()
const path = require('path')
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))


app.use(
  session({
    key: 'user_id',
    secret: process.env.JWT_SECRET || 'my_secret_key_',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Mount Routers
app.use('/user', userRoutes);
app.use('/country', countryRoutes);
app.use('/profile', profileRoutes);
app.use('/follow', followRoutes);
app.use('/blog', blogRoutes);

app.listen(port, () => {
  console.log('Server is running on port', port);
});