import { supabase } from 'boot/supabase'

/**
 * Parse `@username` mentions in text content and match them to real users.
 *
 * @param {string} content - The text to search through.
 * @returns {Promise<Array<{ username: string, user_id: string }>>}
 */
export async function parseMentions(content) {
  const mentionPattern = /@([a-zA-Z0-9_]+)/g
  const rawMatches = [...content.matchAll(mentionPattern)]
  const usernames = [...new Set(rawMatches.map((m) => m[1]))]

  if (usernames.length === 0) return []

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username')
    .in('username', usernames)

  if (error) throw error

  return profiles.map((p) => ({
    username: p.username,
    user_id: p.id,
  }))
}
