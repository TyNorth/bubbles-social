import { defineStore } from 'pinia'
import { getBubbleRelations } from 'src/db/relations'
import { logCuriosityPath } from 'src/db/curiosity'

/**
 * @typedef {Object} BubbleRelation
 * @property {string} id
 * @property {string} from_bubble
 * @property {string} to_bubble
 * @property {'similar'|'contrast'|'nested'} relation_type
 * @property {string} notes
 * @property {string} created_at
 */

export const useSuggestionStore = defineStore('suggestion', {
  state: () => ({
    vertical: [],
    lateral: [],
    loop: [],
    reflect: [],
    loading: false,
  }),

  actions: {
    /**
     * Fetch suggestions based on bubble relations
     * @param {string} bubbleId
     */
    async fetchSuggestions(bubbleId) {
      this.loading = true
      const allRelations = await getBubbleRelations(bubbleId)

      this.vertical = allRelations.filter((r) => r.relation_type === 'nested')
      this.lateral = allRelations.filter((r) => r.relation_type === 'contrast')
      // Loop and reflect will be computed later via curiosity path + interaction logs

      this.loading = false
    },

    /**
     * Manually log a curiosity path to the backend
     * @param {Object} pathData
     */
    async logPath(pathData) {
      await logCuriosityPath(pathData)
    },
  },
})
