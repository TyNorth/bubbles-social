import { supabase } from 'boot/supabase'

/**
 * Sign up a user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse>}
 */
export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password })
}

/**
 * Log in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse>}
 */
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the current user session (if any)
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * Get current authenticated user
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
