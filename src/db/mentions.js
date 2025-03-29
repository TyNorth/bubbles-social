import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Mention
 * @property {string} id
 * @property {string} mentioned_user_id
 * @property {string} from_user_id
 * @property {string|null} post_id
 * @property {string|null} comment_id
 * @property {string} created_at
 */

/**
 * Create a mention record (linked to post or comment)
 * @param {Omit<Mention, 'id' | 'created_at'>} mention
 * @returns {Promise<Mention>}
 */
export async function logMention(mention) {
  const { data, error } = await supabase.from('mentions').insert([mention]).select().single()

  if (error) throw error
  return data
}

/**
 * Get all mentions of a user
 * @param {string} userId
 * @returns {Promise<Mention[]>}
 */
export async function getMentions(userId) {
  const { data, error } = await supabase
    .from('mentions')
    .select('*')
    .eq('mentioned_user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
