import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} user_id
 * @property {string} bubble_id
 * @property {string} content
 * @property {string} media_url
 * @property {string[]} tags
 * @property {string} level_tag
 * @property {string} created_at
 */

/**
 * @typedef {Object} PostMeta
 * @property {string} post_id
 * @property {string} tone
 * @property {number} complexity
 * @property {string} ai_summary
 * @property {string[]} related_topics
 */

/**
 * Create a new post with optional metadata
 * @param {Partial<Post>} post
 * @param {Partial<PostMeta>} [meta]
 * @returns {Promise<Post>}
 */
export async function createPost(post, meta) {
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single()

  if (postError) throw postError

  if (meta) {
    const { error: metaError } = await supabase
      .from('post_meta')
      .insert([{ ...meta, post_id: postData.id }])

    if (metaError) throw metaError
  }

  return postData
}

/**
 * Fetch posts for a specific bubble
 * @param {string} bubbleId
 * @returns {Promise<(Post & { meta: PostMeta })[]>}
 */
export async function getPostsByBubble(bubbleId) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      post_meta (
        tone,
        complexity,
        ai_summary,
        related_topics
      )
    `,
    )
    .eq('bubble_id', bubbleId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get a single post by ID, including meta
 * @param {string} postId
 * @returns {Promise<(Post & { meta: PostMeta })>}
 */
export async function getPostById(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      post_meta (
        tone,
        complexity,
        ai_summary,
        related_topics
      )
    `,
    )
    .eq('id', postId)
    .single()

  if (error) throw error
  return data
}
