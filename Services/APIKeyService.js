const session = require('express-session')
const APIKeyDAO = require('../DAOs/APIKeyDAO')
const {v4 : uuidv4} = require('uuid')

class APIKeyService{
    constructor(){
        this.apikeydao = new APIKeyDAO()
    }

    async createAPIKey (userId){
        const key = uuidv4()
        return await this.apikeydao.create(userId, key)
    }

    async validateApiKey (key){
        const result = await this.apikeydao.getById(key)
        return result
    }
}

module.exports = APIKeyService;

