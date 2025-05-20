const pool = require('../Database/SQLCon');
const ProfileDAO = require('./../DAOs/ProfileDAO');

const getUserIdByUsername = async (username) => {
  const user = await ProfileDAO.getUserByUsername(username);
  return user?.id;
};

const followUser = async (followerUsername, followedUsername) => {
  const followerId = await getUserIdByUsername(followerUsername);
  const followedId = await getUserIdByUsername(followedUsername);
  if (!followerId || !followedId) throw new Error("Invalid users");

  await pool.query(`INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (?, ?)`, [followerId, followedId]);
};

const unfollowUser = async (followerUsername, followedUsername) => {
  const followerId = await getUserIdByUsername(followerUsername);
  const followedId = await getUserIdByUsername(followedUsername);
  if (!followerId || !followedId) throw new Error("Invalid users");

  await pool.query(`DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`, [followerId, followedId]);
};

//Checks if a user (followerUsername) is following another user (followedUsername)
const isFollowing = async (followerUsername, followedUsername) => {
  const followerId = await getUserIdByUsername(followerUsername);
  const followedId = await getUserIdByUsername(followedUsername);
  const [rows] = await pool.query(
    `SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?`,
    [followerId, followedId]
  );
  return rows.length > 0;
};

module.exports = {
  followUser,
  unfollowUser,
  isFollowing,
};
