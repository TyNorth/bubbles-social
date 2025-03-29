import { defineStore } from 'pinia'
import { getPublicBubbles, createBubble } from 'src/db/bubbles'
import { getUserMemberships, joinBubble } from 'src/db/memberships'

/**
 * @typedef {Object} Bubble
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} tags
 * @property {string[]} level_tags
 * @property {string} visibility
 * @property {string} created_at
 */

export const useBubbleStore = defineStore('bubble', {
  state: () => ({
    all: [],
    myBubbles: [],
    activeBubbleId: null,
  }),

  actions: {
    /**
     * Load all public bubbles
     */
    async fetchAll() {
      this.all = await getPublicBubbles()
    },

    /**
     * Load all bubbles this user has joined
     * @param {string} userId
     */
    async fetchMyBubbles(userId) {
      const memberships = await getUserMemberships(userId)
      this.myBubbles = memberships.map((m) => m.bubble_id)
    },

    /**
     * Join a bubble
     * @param {string} userId
     * @param {string} bubbleId
     */
    async join(userId, bubbleId) {
      await joinBubble(userId, bubbleId)
      if (!this.myBubbles.includes(bubbleId)) this.myBubbles.push(bubbleId)
    },

    /**
     * Set the currently viewed bubble
     * @param {string} id
     */
    setActiveBubble(id) {
      this.activeBubbleId = id
    },
  },

  getters: {
    /**
     * Get the active bubble object
     * @returns {Bubble | undefined}
     */
    activeBubble(state) {
      return state.all.find((b) => b.id === state.activeBubbleId)
    },
  },
})
