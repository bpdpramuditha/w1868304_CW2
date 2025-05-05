
const APIKeyService = require('../Services/APIKeyService')

const apiKeyMiddleware = async(req, res, next) => {
    const key = req.header('X-API-Key')

    if(!key){
        return res.status(403).json({error : 'Missing API key'})
    }

    this.apikeyservice = new APIKeyService()
    try {
        const result = await this.apikeyservice.validateApiKey(key)
        if(!result.success){
            return res.status(403).json({error : 'Invalid Key'})
        }
        req.key = result.data
        next()

    } catch (error) {
        return res.status(500).json({error : error})
    }
}

module.exports = apiKeyMiddleware