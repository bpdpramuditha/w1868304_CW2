const profileDB = require('../DAOs/ProfileDAO')

const getProfile = async (username) => {
  const user = await profileDB.getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  const posts = await profileDB.getUserPosts(user.id);
  const followers = await profileDB.getFollowerCount(user.id);
  const following = await profileDB.getFollowingCount(user.id);

  user.full_name = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return {
    user,
    posts,
    followers,
    following,
  };
};

module.exports = {
  getProfile,
};
