const FollowDAO = require('../DAOs/FollowDAO');
const ProfileDAO = require('./../DAOs/ProfileDAO');

const followUser = async (follower, followed) => {
  return await FollowDAO.followUser(follower, followed);
};

const unfollowUser = async (follower, followed) => {
  return await FollowDAO.unfollowUser(follower, followed);
};

const checkIfFollowing = async (follower, followed) => {
  return await FollowDAO.isFollowing(follower, followed);
};

const getFeedPosts = async (username) => {
  const user = await ProfileDAO.getUserByUsername(username);
  if (!user) throw new Error("User not found");
  return await FollowDAO.getFollowedUsersPosts(user.id);
};

module.exports = {
  followUser,
  unfollowUser,
  checkIfFollowing,
  getFeedPosts
};
