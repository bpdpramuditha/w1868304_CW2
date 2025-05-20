const FollowDAO = require('../DAOs/FollowDAO');

const followUser = async (follower, followed) => {
  return await FollowDAO.followUser(follower, followed);
};

const unfollowUser = async (follower, followed) => {
  return await FollowDAO.unfollowUser(follower, followed);
};

const checkIfFollowing = async (follower, followed) => {
  return await FollowDAO.isFollowing(follower, followed);
};


module.exports = {
  followUser,
  unfollowUser,
  checkIfFollowing,
};
