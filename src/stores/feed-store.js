import { defineStore } from 'pinia'
import { getPostsByBubble } from 'src/db/posts'

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} user_id
 * @property {string} bubble_id
 * @property {string} content
 * @property {string} media_url
 * @property {string[]} tags
 * @property {string} level_tag
 * @property {string} created_at
 * @property {Object} post_meta
 */

export const useFeedStore = defineStore('feed', {
  state: () => ({
    posts: [],
    loading: false,
  }),

  actions: {
    /**
     * Fetch posts for a specific bubble
     * @param {string} bubbleId
     */
    async fetchPosts(bubbleId) {
      this.loading = true
      try {
        this.posts = await getPostsByBubble(bubbleId)
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear posts from state
     */
    clear() {
      this.posts = []
    },
  },
})
