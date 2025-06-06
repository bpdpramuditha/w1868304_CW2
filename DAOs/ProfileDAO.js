const pool = require('../Database/SQLCon')

const getUserByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT id, username, fn, sn, profile_picture FROM users WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
};

const getFollowerCount = async (userId) => {
  const [[{ followers }]] = await pool.query(
    `SELECT COUNT(*) AS followers FROM follows WHERE followed_id = ?`,
    [userId]
  );
  return followers;
};

const getFollowingCount = async (userId) => {
  const [[{ following }]] = await pool.query(
    `SELECT COUNT(*) AS following FROM follows WHERE follower_id = ?`,
    [userId]
  );
  return following;
};

module.exports = {
  getUserByUsername,
  getFollowerCount,
  getFollowingCount,
};