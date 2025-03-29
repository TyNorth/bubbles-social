import { defineStore } from 'pinia'
import { createNotification, getNotifications, markAsRead } from 'src/db/notifications'

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} user_id
 * @property {string} type
 * @property {string} related_id
 * @property {Object} metadata
 * @property {boolean} read
 * @property {string} created_at
 */

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    loading: false,
  }),

  actions: {
    /**
     * Load all notifications for a user
     * @param {string} userId
     */
    async fetch(userId) {
      this.loading = true
      try {
        this.notifications = await getNotifications(userId)
      } finally {
        this.loading = false
      }
    },

    /**
     * Mark a single notification as read
     * @param {string} id
     */
    async markRead(id) {
      await markAsRead(id)
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) this.notifications[index].read = true
    },

    /**
     * Add a new notification
     * @param {Object} payload
     */
    async push(payload) {
      const result = await createNotification(payload)
      this.notifications.unshift(result)
    },
  },

  getters: {
    unread() {
      return this.notifications.filter((n) => !n.read)
    },
  },
})
