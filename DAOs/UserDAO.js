const pool = require('../Database/SQLCon')
const {createResponse} = require('../Utilities/createResponse')

class UserDAO{

    async getUserByEmail(email, returnData = false) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const [rows] = await pool.query(sql, [email]);
    
            if (rows.length > 0) {
                if (returnData) {
                    return createResponse(true, rows); 
                }
                return true; 
            } else {
                if (returnData) {
                    return createResponse(false, 'User not found');
                }
                return false;
            }
        } catch (err) {
            console.error('Database Error:', err);
            throw err;
        }
    }
    
    async create(userData) {
        try {
            const sql = 'INSERT INTO users (email, password, fn, sn) VALUES (?, ?, ?, ?)';
            const values = [userData.email, userData.password, userData.fn, userData.sn];

            const [rows] = await pool.query(sql, values);
            return createResponse(true, 'Record Inserted');
        } catch (err) {
            console.error('Database Error:', err);
            throw err;
        }
    }  
}

module.exports = UserDAO;