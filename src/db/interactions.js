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

export async function getInteraction(userId, postId) {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('type')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle() // Expecting at most one interaction per user/post

    if (error) {
      console.error('Error fetching interaction:', error)
      return null
    }
    return data ? data.type : 'neutral' // Default to 'neutral' if no interaction exists
  } catch (error) {
    console.error('Error fetching interaction:', error)
    return null
  }
}

export async function updateInteraction(userId, postId, type) {
  try {
    // Check if an interaction already exists
    const existingInteraction = await getInteraction(userId, postId)

    if (existingInteraction && existingInteraction !== 'neutral' && type === 'neutral') {
      // Delete the interaction if toggling from like/dislike to neutral
      const { error: deleteError } = await supabase
        .from('interactions')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)

      if (deleteError) {
        console.error('Error deleting interaction:', deleteError)
        return false
      }
      return true
    } else if (existingInteraction && existingInteraction !== 'neutral') {
      // Update the existing interaction
      const { error: updateError } = await supabase
        .from('interactions')
        .update({ type })
        .eq('user_id', userId)
        .eq('post_id', postId)

      if (updateError) {
        console.error('Error updating interaction:', updateError)
        return false
      }
      return true
    } else {
      // Insert a new interaction
      const { error: insertError } = await supabase
        .from('interactions')
        .insert([{ user_id: userId, post_id: postId, type }])

      if (insertError) {
        console.error('Error inserting interaction:', insertError)
        return false
      }
      return true
    }
  } catch (error) {
    console.error('Error updating/inserting interaction:', error)
    return false
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
