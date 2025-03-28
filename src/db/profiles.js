import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Profile
 * @property {string} id - Supabase Auth user ID (UUID)
 * @property {string} username
 * @property {string} bio
 * @property {string} avatar_url
 * @property {string} created_at
 */

/**
 * Fetch a single profile by user ID
 * @param {string} userId
 * @returns {Promise<Profile>}
 */
export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) throw error
  return data
}

/**
 * Update the current user's profile
 * @param {Partial<Profile>} updates
 * @returns {Promise<Profile>}
 */
export async function updateProfile(updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', updates.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new user profile (used post-signup)
 * @param {Profile} profile
 * @returns {Promise<Profile>}
 */
export async function createProfile(profile) {
  const { data, error } = await supabase.from('profiles').insert([profile]).select().single()

  if (error) throw error
  return data
}
