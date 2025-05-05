const pool = require('../Database/SQLCon')
const {createResponse} = require('../Utilities/createResponse')


class APIKeyDAO {
    async create(id, key) {
        try {
            const sql = 'INSERT INTO apikeys (userID, apikey) VALUES (?, ?)';
            const values = [id, key];
    
            const [rows] = await pool.query(sql, values);
            return createResponse(true, key);
        } catch (err) {
            console.error('Database Error:', err);
            throw err;
        }
    }

    async getById(key) {
        try {
            const sql = 'SELECT isActive from apikeys where apikey = ? and isActive = 1';
            const values = [key];
    
            const [rows] = await pool.query(sql, values);

            if (rows.length === 0){
                return createResponse(false, 'null');
            }
            return createResponse(true, rows[0]);
        } catch (err) {
            console.error('Database Error:', err);
            throw err;
        }
    }

}

module.exports = APIKeyDAO;