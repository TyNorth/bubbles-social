import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Interaction
 * @property {string} id
 * @property {string} user_id
 * @property {string} post_id
 * @property {'like'|'comment'|'peek'|'expand'|'save'} type
 * @property {string} engaged_time
 * @property {string} created_at
 */

/**
 * Log a user interaction with a post
 * @param {Omit<Interaction, 'id' | 'created_at'>} interaction
 * @returns {Promise<Interaction[]>}
 */
export async function logInteraction(interaction) {
  const { data, error } = await supabase.from('interactions').insert([interaction]).select()

  if (error) throw error
  return data
}

/**
 * Get all interactions for a user
 * @param {string} userId
 * @returns {Promise<Interaction[]>}
 */
export async function getUserInteractions(userId) {
  const { data, error } = await supabase.from('interactions').select('*').eq('user_id', userId)

  if (error) throw error
  return data
}

/**
 * Get all interactions for a specific post
 * @param {string} postId
 * @returns {Promise<Interaction[]>}
 */
export async function getPostInteractions(postId) {
  const { data, error } = await supabase.from('interactions').select('*').eq('post_id', postId)

  if (error) throw error
  return data
}
