import { supabase } from 'boot/supabase'

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} user_id       - Who the notification is for
 * @property {string} type          - e.g. 'mention', 'reply', 'like'
 * @property {string} related_id    - post_id or comment_id
 * @property {Object} metadata
 * @property {boolean} read
 * @property {string} created_at
 */

/**
 * Create a new notification
 * @param {Omit<Notification, 'id' | 'created_at' | 'read'>} notification
 * @returns {Promise<Notification>}
 */
export async function createNotification(notification) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ ...notification, read: false }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get all notifications for a user
 * @param {string} userId
 * @returns {Promise<Notification[]>}
 */
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Mark a notification as read
 * @param {string} id
 */
export async function markAsRead(id) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)

  if (error) throw error
}
