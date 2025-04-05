import { defineStore } from 'pinia'
import { getSession, signIn, signUp, signOut } from 'src/db/auth'

/**
 * @typedef {Object} AuthState
 * @property {import('@supabase/supabase-js').User | null} user
 * @property {boolean} loaded
 */

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false,
  }),

  actions: {
    /**
     * Fetch and store the current authenticated user
     */
    async fetchUser() {
      const session = await getSession()
      this.user = session?.user || null
      this.loaded = true
    },

    /**
     * Sign in a user and update state
     * @param {string} email
     * @param {string} password
     */
    async login(email, password) {
      const { user } = await signIn(email, password)
      this.user = user
    },

    /**
     * Sign up a new user and update state
     * @param {string} email
     * @param {string} password
     */
    async register(email, password) {
      const { user } = await signUp(email, password)
      this.user = user
    },

    /**
     * Log out the current user
     */
    async logout() {
      await signOut()
      this.user = null
    },
  },
})
