const pool = require('../Database/SQLCon');
const { createResponse } = require('../Utilities/createResponse');

class UserDAO {
  async getUserByEmail(email, returnData = false) {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query(sql, [email]);

      if (rows.length > 0) {
        return returnData ? createResponse(true, rows) : true;
      } else {
        return returnData ? createResponse(false, 'User not found') : false;
      }
    } catch (err) {
      console.error('Database Error:', err);
      throw err;
    }
  }

  async create(userData) {
    try {
      const username = `${userData.email.split('@')[0]}_${Math.floor(Math.random() * 10000)}`;
      const profilePic = 'https://via.placeholder.com/120x120?text=User';
      const sql = `
        INSERT INTO users (email, password, fn, sn, username, profile_picture)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        userData.email,
        userData.password,
        userData.fn,
        userData.sn,
        username,
        profilePic
      ];
      await pool.query(sql, values);
      return createResponse(true, 'Record Inserted');
    } catch (err) {
      console.error('Database Error:', err);
      throw err;
    }
  }

  async getFollowers(username) {
    try {
      const [rows] = await pool.query(`
        SELECT u.username, u.profile_picture 
        FROM follows f
        JOIN users u ON f.follower_id = u.id
        WHERE f.followed_id = (SELECT id FROM users WHERE username = ?)
      `, [username]);
      return rows;
    } catch (err) {
      console.error('Database Error in getFollowers:', err);
      throw err;
    }
  }

  async getFollowing(username) {
    try {
      const [rows] = await pool.query(`
        SELECT u.username, u.profile_picture 
        FROM follows f
        JOIN users u ON f.followed_id = u.id
        WHERE f.follower_id = (SELECT id FROM users WHERE username = ?)
      `, [username]);
      return rows;
    } catch (err) {
      console.error('Database Error in getFollowing:', err);
      throw err;
    }
  }
}

module.exports = new UserDAO(); 
