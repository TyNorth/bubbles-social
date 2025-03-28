import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} BubbleRelation
 * @property {string} id
 * @property {string} from_bubble
 * @property {string} to_bubble
 * @property {'similar'|'contrast'|'nested'} relation_type
 * @property {string} notes
 * @property {string} created_at
 */

/**
 * Create a bubble-to-bubble relationship
 * @param {Omit<BubbleRelation, 'id' | 'created_at'>} relation
 * @returns {Promise<BubbleRelation[]>}
 */
export async function createBubbleRelation(relation) {
  const { data, error } = await supabase.from('bubble_relations').insert([relation]).select()

  if (error) throw error
  return data
}

/**
 * Get all related bubbles for a given bubble
 * @param {string} bubbleId
 * @returns {Promise<BubbleRelation[]>}
 */
export async function getBubbleRelations(bubbleId) {
  const { data, error } = await supabase
    .from('bubble_relations')
    .select('*')
    .or(`from_bubble.eq.${bubbleId},to_bubble.eq.${bubbleId}`)

  if (error) throw error
  return data
}

/**
 * Get all bubble relations of a specific type (e.g. 'contrast')
 * @param {string} bubbleId
 * @param {'similar'|'contrast'|'nested'} type
 * @returns {Promise<BubbleRelation[]>}
 */
export async function getRelationsByType(bubbleId, type) {
  const { data, error } = await supabase
    .from('bubble_relations')
    .select('*')
    .or(`from_bubble.eq.${bubbleId},to_bubble.eq.${bubbleId}`)
    .eq('relation_type', type)

  if (error) throw error
  return data
}
