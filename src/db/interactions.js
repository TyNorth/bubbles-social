import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Interaction
 * @property {string} id
 * @property {string} user_id
 * @property {string} post_id
 * @property {'like'|'comment'|'peek'|'expand'|'save'|'dislike'} type
 * @property {string} engaged_time
 * @property {string} created_at
 */

/**
 * Toggle a like or dislike for a given user & post
 * Ensures the user can only have one 'like' or 'dislike' at a time per post.
 * @param {string} userId
 * @param {string} postId
 * @param {'like' | 'dislike'} type
 * @returns {Promise<'added' | 'removed'>}
 */
export async function toggleInteraction(userId, postId, type) {
  const oppositeType = type === 'like' ? 'dislike' : 'like'

  // Remove any opposite interaction first
  const { data: existingOpposite } = await supabase
    .from('interactions')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .eq('type', oppositeType)

  if (existingOpposite?.length) {
    await supabase.from('interactions').delete().eq('id', existingOpposite[0].id)
  }

  // Then toggle current type
  const { data: existing, error: fetchError } = await supabase
    .from('interactions')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .eq('type', type)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

  if (existing) {
    const { error: deleteError } = await supabase
      .from('interactions')
      .delete()
      .eq('id', existing.id)
    if (deleteError) throw deleteError
    return 'removed'
  } else {
    const { error: insertError } = await supabase
      .from('interactions')
      .insert([{ user_id: userId, post_id: postId, type }])
    if (insertError) throw insertError
    return 'added'
  }
}

export async function logInteraction(interaction) {
  const { data, error } = await supabase.from('interactions').insert([interaction]).select()
  if (error) throw error
  return data
}

export async function getUserInteractions(userId) {
  const { data, error } = await supabase.from('interactions').select('*').eq('user_id', userId)
  if (error) throw error
  return data
}

export async function getPostInteractions(postId) {
  const { data, error } = await supabase.from('interactions').select('*').eq('post_id', postId)
  if (error) throw error
  return data
}
