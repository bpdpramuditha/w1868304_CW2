const checkSession = async (req, res, next) =>{
    if(!req.session.isAuthenticated){
        return res.status(402).json({error: "User is not Loged in"})
    }
    next()
}

module.exports = checkSession