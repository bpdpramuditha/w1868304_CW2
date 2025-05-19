const profileDB = require('../DAOs/ProfileDAO')

const getProfile = async (username) => {
  const user = await profileDB.getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  const followers = await profileDB.getFollowerCount(user.id);
  const following = await profileDB.getFollowingCount(user.id);

  return {
    user,
    followers,
    following,
  };
};

module.exports = {
  getProfile,
};