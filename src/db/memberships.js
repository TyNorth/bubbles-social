import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} BubbleMembership
 * @property {string} id
 * @property {string} user_id
 * @property {string} bubble_id
 * @property {string} role
 * @property {string} joined_at
 */

/**
 * Get all bubble memberships for a specific user.
 * @param {string} userId
 * @returns {Promise<BubbleMembership[]>}
 */
export async function getUserMemberships(userId) {
  const { data, error } = await supabase
    .from('bubble_memberships')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

/**
 * Join a bubble
 * @param {string} userId
 * @param {string} bubbleId
 * @returns {Promise<BubbleMembership[]>}
 */
export async function joinBubble(userId, bubbleId) {
  const { data, error } = await supabase
    .from('bubble_memberships')
    .insert([{ user_id: userId, bubble_id: bubbleId }])
    .select()

  if (error) throw error
  return data
}
