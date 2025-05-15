const userDAO = require('../DAOs/UserDAO'); // ← use lowercase to indicate instance
const { generateHash, verify } = require('../Utilities/bcryptUtil');
const { createResponse } = require('../Utilities/createResponse');

class UserService {
    constructor() {
        this.userDAO = userDAO; // ✅ just assign the imported instance
    }

    async create(req) {
        try {
            req.body.password = await generateHash(req.body.password);
            const userExists = await this.userDAO.getUserByEmail(req.body.email);
            if (userExists) {
                return {
                    success: false,
                    message: 'User already exists with this email'
                };
            } else {
                const result = await this.userDAO.create(req.body);
                return result;
            }

        } catch (error) {
            console.error(error);
            return createResponse(false, 'Internal server error');
        }
    }

    async authenticate(req) {
        try {
            const result = await this.userDAO.getUserByEmail(req.body.email, true);
            if (result.success && result.data.length > 0) {
                const user = result.data[0];
                const isMatch = await verify(req.body.password, user.password);

                if (!isMatch) {
                    return {
                        success: false,
                        message: 'Invalid password'
                    };
                }

                req.session.user = {
                    id: user.id,
                    email: user.email,
                    username: user.username
                };
                req.session.isAuthenticated = true;

                return {
                    success: true,
                    message: 'Login Successful!'
                };

            } else {
                return {
                    success: false,
                    message: 'User not Found, Register'
                };
            }

        } catch (error) {
            console.error(error);
            return createResponse(false, 'Internal server error');
        }
    }
}

module.exports = UserService;
