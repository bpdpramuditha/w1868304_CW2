const UserInteractionDAO = require('../DAOs/UserInteractionDAO');
const userInteractionDAO = new UserInteractionDAO();

async function likePost(userId, postId) {
  return await userInteractionDAO.likePost(userId, postId);
}

async function dislikePost(userId, postId) {
  return await userInteractionDAO.dislikePost(userId, postId);
}

async function getAllPosts() {
  return await userInteractionDAO.getAllPostsWithInteractions();
}

async function getInteractionCounts(postId) {
  const result = await userInteractionDAO.getPostCounts(postId); 
  return {
    likes: result?.likes || 0,
    dislikes: result?.dislikes || 0,
  };
}

module.exports = {
  likePost,
  dislikePost,
  getAllPosts,
  getInteractionCounts,
};
