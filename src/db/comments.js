import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} post_id
 * @property {string} user_id
 * @property {string} content
 * @property {string|null} parent_id
 * @property {string} created_at
 */

/**
 * Create a new comment or reply
 * @param {Omit<Comment, 'id' | 'created_at'>} comment
 * @returns {Promise<Comment>}
 */
export async function createComment(comment) {
  const { data, error } = await supabase.from('comments').insert([comment]).select().single()

  if (error) throw error
  return data
}

/**
 * Get all comments for a post (flat or threaded)
 * @param {string} postId
 * @returns {Promise<Comment[]>}
 */
export async function getCommentsByPost(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get replies to a specific comment
 * @param {string} parentId
 * @returns {Promise<Comment[]>}
 */
export async function getReplies(parentId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at')

  if (error) throw error
  return data
}
