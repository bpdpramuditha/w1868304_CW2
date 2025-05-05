const express = require('express')
const session = require('express-session')
const UserService = require('./Services/UserService')
const APIKeyService = require('./Services/APIKeyService')
const apiKeyMiddleware = require('./Middleware/APIAuthMiddleware')
const  FetchCountryData = require('./Services/FetchCountryData')
const checkSession  = require('./Middleware/SessionMiddleware')

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

app.get('/country/:name', checkSession, apiKeyMiddleware, async (req, res) => {
    const countryName = req.params.name;
    const fetchCountryData = new FetchCountryData();
    const data = await fetchCountryData.getCountryData(countryName);
    res.json(data);
});

app.listen(port, () => {
    console.log("Server is running on port", port);
});