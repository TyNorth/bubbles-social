import { defineStore } from 'pinia'
import { getInteraction, updateInteraction, getUserInteractions } from 'src/db/interactions'
import { useAuthStore } from 'stores/auth-store'
import { ref } from 'vue'

/**
 * @typedef {'like'|'dislike'|'save'|'peek'|'expand'|'comment'|'neutral'} InteractionType
 */

export const useInteractionStore = defineStore('interaction', () => {
  const authStore = useAuthStore()

  // Object keyed by postId: { postId: 'like' | 'dislike' | 'neutral' }
  const interactions = ref({})

  /**
   * Get interaction type for a specific post
   * @param {string} postId
   * @returns {InteractionType}
   */
  function getPostInteraction(postId) {
    return interactions.value[postId] || 'neutral'
  }

  /**
   * Fetch interaction for a specific post and store it
   * @param {string} postId
   */
  async function fetchInteraction(postId) {
    if (!authStore.user?.id) return
    const type = await getInteraction(authStore.user.id, postId)
    interactions.value[postId] = type || 'neutral'
  }

  /**
   * Fetch all interactions for the user and populate state
   * @param {string} userId
   */
  async function fetchByUser(userId) {
    const all = await getUserInteractions(userId)
    const result = {}
    for (const i of all) {
      result[i.post_id] = i.type
    }
    interactions.value = result
  }

  /**
   * Update or insert interaction in DB and store
   * @param {string} postId
   * @param {InteractionType} type
   * @returns {Promise<boolean>}
   */
  async function setInteraction(postId, type) {
    if (!authStore.user?.id) return false

    const success = await updateInteraction(authStore.user.id, postId, type)
    if (success) {
      interactions.value[postId] = type
    }
    return success
  }

  function getCountsByPost(postId) {
    const all = Object.entries(interactions.value)
    return {
      like: all.filter(([id, type]) => id === postId && type === 'like').length,
      dislike: all.filter(([id, type]) => id === postId && type === 'dislike').length,
    }
  }

  return {
    interactions,
    getPostInteraction,
    fetchInteraction,
    fetchByUser,
    setInteraction,
    getCountsByPost,
  }
})
