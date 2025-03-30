import { defineStore } from 'pinia'
import { logInteraction, getUserInteractions, toggleInteraction } from 'src/db/interactions'

/**
 * @typedef {'like'|'peek'|'expand'|'save'|'comment'|'dislike'} InteractionType
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
     * Toggle a like/dislike interaction
     * @param {Object} options
     * @param {string} options.userId
     * @param {string} options.postId
     * @param {InteractionType} options.type
     * @returns {Promise<{ result: 'added' | 'removed', hadBefore: boolean, hadOpposite: boolean }>}
     */
    async toggle({ userId, postId, type }) {
      const oppositeType = type === 'like' ? 'dislike' : type === 'dislike' ? 'like' : null

      // Remove opposite if it exists in local store
      if (oppositeType) {
        this.interactions = this.interactions.filter(
          (i) => !(i.post_id === postId && i.user_id === userId && i.type === oppositeType),
        )
      }

      const interactions = this.getByPost(postId)
      const hasType = interactions.some((i) => i.type === type && i.user_id === userId)
      const hasOpposite = interactions.some((i) => i.type === oppositeType && i.user_id === userId)

      const result = await toggleInteraction(userId, postId, type)
      await this.fetchByUser(userId)

      return {
        result,
        hadBefore: hasType,
        hadOpposite: hasOpposite,
      }
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

    /**
     * Check if user has interacted with a post in a certain way
     * @param {string} postId
     * @param {InteractionType} type
     * @param {string} userId
     * @returns {boolean}
     */
    hasInteraction(postId, type, userId) {
      return this.interactions.some(
        (i) => i.post_id === postId && i.user_id === userId && i.type === type,
      )
    },
  },
})
