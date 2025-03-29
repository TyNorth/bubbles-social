import { defineStore } from 'pinia'
import { getMentions } from 'src/db/mentions'

/**
 * @typedef {Object} Mention
 * @property {string} id
 * @property {string} mentioned_user_id
 * @property {string} from_user_id
 * @property {string|null} post_id
 * @property {string|null} comment_id
 * @property {string} created_at
 */

export const useMentionStore = defineStore('mention', {
  state: () => ({
    mentions: [],
    loading: false,
  }),

  actions: {
    /**
     * Load all mentions for a user
     * @param {string} userId
     */
    async fetch(userId) {
      this.loading = true
      try {
        this.mentions = await getMentions(userId)
      } finally {
        this.loading = false
      }
    },
  },
})
