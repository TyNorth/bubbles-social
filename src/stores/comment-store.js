import { defineStore } from 'pinia'
import { createComment, getCommentsByPost, getReplies } from 'src/db/comments'

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} post_id
 * @property {string} user_id
 * @property {string} content
 * @property {string|null} parent_id
 * @property {string} created_at
 */

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
    loading: false,
  }),

  actions: {
    /**
     * Load all comments for a given post
     * @param {string} postId
     */
    async fetchByPost(postId) {
      this.loading = true
      try {
        this.comments = await getCommentsByPost(postId)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add a new comment or reply
     * @param {Omit<Comment, 'id' | 'created_at'>} comment
     */
    async add(comment) {
      const newComment = await createComment(comment)
      this.comments.push(newComment)
    },

    /**
     * Get all top-level comments
     * @returns {Comment[]}
     */
    rootComments() {
      return this.comments.filter((c) => !c.parent_id)
    },

    /**
     * Get replies to a specific comment (lazy load fallback)
     * @param {string} parentId
     * @returns {Promise<Comment[]>}
     */
    async fetchReplies(parentId) {
      const replies = await getReplies(parentId)
      this.comments.push(...replies)
      return replies
    },

    /**
     * Get replies already in state
     * @param {string} parentId
     * @returns {Comment[]}
     */
    getRepliesFromState(parentId) {
      return this.comments.filter((c) => c.parent_id === parentId)
    },
  },
})
