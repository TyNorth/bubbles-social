import { defineStore } from 'pinia'
import { logInteraction, getUserInteractions } from 'src/db/interactions'

/**
 * @typedef {'like'|'peek'|'expand'|'save'|'comment'} InteractionType
 */

/**
 * @typedef {Object} Interaction
 * @property {string} id
 * @property {string} user_id
 * @property {string} post_id
 * @property {InteractionType} type
 * @property {string} engaged_time
 * @property {string} created_at
 */

export const useInteractionStore = defineStore('interaction', {
  state: () => ({
    interactions: [],
  }),

  actions: {
    /**
     * Log a user interaction with a post
     * @param {Omit<Interaction, 'id' | 'created_at'>} payload
     */
    async track(payload) {
      const result = await logInteraction(payload)
      this.interactions.push(...result)
    },

    /**
     * Load all interactions by the user
     * @param {string} userId
     */
    async fetchByUser(userId) {
      this.interactions = await getUserInteractions(userId)
    },

    /**
     * Get interaction type(s) for a specific post
     * @param {string} postId
     * @returns {Interaction[]}
     */
    getByPost(postId) {
      return this.interactions.filter((i) => i.post_id === postId)
    },
  },
})
