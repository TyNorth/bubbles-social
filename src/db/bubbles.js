import { supabase } from 'boot/supabase'

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

/**
 * Get all public bubbles
 * @returns {Promise<Bubble[]>}
 */
export async function getPublicBubbles() {
  const { data, error } = await supabase.from('bubbles').select('*').eq('visibility', 'public')

  if (error) throw error
  return data
}

/**
 * Create a new bubble
 * @param {Partial<Bubble>} bubble
 * @returns {Promise<Bubble[]>}
 */
export async function createBubble(bubble) {
  const { data, error } = await supabase.from('bubbles').insert([bubble]).select()

  if (error) throw error
  return data
}
