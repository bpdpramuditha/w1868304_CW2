const pool = require('../Database/SQLCon');

class UserInteractionDAO {
  async likePost(userId, postId) {
    try {
      await pool.query(
        'DELETE FROM post_interactions WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );
      await pool.query(
        'INSERT INTO post_interactions (user_id, post_id, is_like) VALUES (?, ?, ?)',
        [userId, postId, true]
      );
      return { success: true, message: 'Post liked successfully' };
    } catch (err) {
      console.error('Database Error in likePost:', err);
      throw err;
    }
  }

  async dislikePost(userId, postId) {
    try {
      await pool.query(
        'DELETE FROM post_interactions WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );
      await pool.query(
        'INSERT INTO post_interactions (user_id, post_id, is_like) VALUES (?, ?, ?)',
        [userId, postId, false]
      );
      return { success: true, message: 'Post disliked successfully' };
    } catch (err) {
      console.error('Database Error in dislikePost:', err);
      throw err;
    }
  }

  async getAllPostsWithInteractions() {
    try {
      const sql = `
        SELECT bp.*, u.username, u.profile_picture,
          (SELECT COUNT(*) FROM post_interactions pi WHERE pi.post_id = bp.id AND pi.is_like = TRUE) AS likes,
          (SELECT COUNT(*) FROM post_interactions pi WHERE pi.post_id = bp.id AND pi.is_like = FALSE) AS dislikes
        FROM blog_posts bp
        JOIN users u ON bp.user_id = u.id
        ORDER BY bp.created_at DESC
      `;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (err) {
      console.error('Database Error in getAllPostsWithInteractions:', err);
      throw err;
    }
  }

  async getPostCounts(postId) {
    try {
      const [rows] = await pool.query(`
        SELECT
          SUM(CASE WHEN is_like = TRUE THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = FALSE THEN 1 ELSE 0 END) AS dislikes
        FROM post_interactions
        WHERE post_id = ?
      `, [postId]);
      return rows[0];
    } catch (err) {
      console.error('Database Error in getPostCounts:', err);
      throw err;
    }
  }
}

module.exports = UserInteractionDAO;
