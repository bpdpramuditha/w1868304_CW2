const pool = require('../Database/SQLCon');

class BlogPostDAO {
  async createPost(userId, title, content, country, dateOfVisit) {
    try {
      const sql = `
        INSERT INTO blog_posts (user_id, title, content, country, date_of_visit)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [userId, title, content, country, dateOfVisit];
      await pool.query(sql, values);
      return { success: true, message: 'Post created successfully' };
    } catch (err) {
      console.error('Database Error in createPost:', err);
      throw err;
    }
  }

  async getAllPosts() {
    try {
      const sql = `
        SELECT bp.*, u.username, u.profile_picture
        FROM blog_posts bp
        JOIN users u ON bp.user_id = u.id
        ORDER BY bp.created_at DESC
      `;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (err) {
      console.error('Database Error in getAllPosts:', err);
      throw err;
    }
  }

    async getPostsByUserId(userId) {
    try {
      const sql = 'SELECT * FROM blog_posts WHERE user_id = ? ORDER BY created_at DESC';
      const [rows] = await pool.query(sql, [userId]);
      return {
        success: true,
        data: rows,
      };
    } catch (err) {
      console.error('Database Error in getPostsByUserId:', err);
      return {
        success: false,
        message: 'Failed to fetch posts',
      };
    }
  }


  async updatePost(postId, userId, title, content, country, dateOfVisit) {
    try {
      const sql = `
        UPDATE blog_posts
        SET title = ?, content = ?, country = ?, date_of_visit = ?
        WHERE id = ? AND user_id = ?
      `;
      const values = [title, content, country, dateOfVisit, postId, userId];
      const [result] = await pool.query(sql, values);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('Database Error in updatePost:', err);
      throw err;
    }
  }

  async deletePost(postId) {
      try {
        const sql = 'DELETE FROM blog_posts WHERE id = ?';
        const [result] = await pool.query(sql, [postId]);
        return result.affectedRows > 0;
      } catch (err) {
        console.error('Database Error in deletePost:', err);
        throw err;
      }
    }
}

module.exports = new BlogPostDAO();
