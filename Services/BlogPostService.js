const blogPostDAO = require('../DAOs/BlogPostDAO');


class BlogPostService {
  async createPost(userId, title, content, country, dateOfVisit) {
    if (!title || !content || !country || !dateOfVisit) {
      return { success: false, message: 'All fields are required' };
    }
    return await blogPostDAO.createPost(userId, title, content, country, dateOfVisit);
  }

  async getAllPosts() {
    return await blogPostDAO.getAllPosts();
  }

  async getPostById(postId) {
    const post = await blogPostDAO.getPostsByUserId(postId);
    if (!post) return { success: false, message: 'Post not found' };
    return { success: true, data: post };
  }

  async updatePost(postId, userId, title, content, country, dateOfVisit) {
    const success = await blogPostDAO.updatePost(postId, userId, title, content, country, dateOfVisit);
    return success
      ? { success: true, message: 'Post updated' }
      : { success: false, message: 'Update failed or unauthorized' };
  }

  async deletePost(postId, userId) {
    const success = await blogPostDAO.deletePost(postId, userId);
    return success
      ? { success: true, message: 'Post deleted' }
      : { success: false, message: 'Delete failed or unauthorized' };
  }
}

module.exports = new BlogPostService();
