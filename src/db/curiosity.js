import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} CuriosityPath
 * @property {string} id
 * @property {string} user_id
 * @property {string} bubble_id
 * @property {string} path_type - 'vertical' | 'lateral' | 'loop' | 'reflect'
 * @property {string} from_tag
 * @property {string} to_tag
 * @property {string} created_at
 */

/**
 * Log a curiosity event (e.g. vertical or lateral move)
 * @param {Omit<CuriosityPath, 'id' | 'created_at'>} path
 * @returns {Promise<CuriosityPath[]>}
 */
export async function logCuriosityPath(path) {
  const { data, error } = await supabase.from('curiosity_paths').insert([path]).select()

  if (error) throw error
  return data
}
