import { defineStore } from 'pinia'
import { getProfile, updateProfile, createProfile } from 'src/db/profiles'

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} username
 * @property {string} bio
 * @property {string} avatar_url
 * @property {boolean} onboarding_complete
 */

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
  }),

  actions: {
    /**
     * Load a profile from Supabase
     * @param {string} userId
     */
    async fetchProfile(userId) {
      this.profile = await getProfile(userId)
    },

    /**
     * Update the user profile in Supabase
     * @param {Partial<Profile>} updates
     */
    async update(updates) {
      const updated = await updateProfile(updates)
      this.profile = updated
    },

    /**
     * Create a new user profile in Supabase
     * @param {Profile} profileData
     */
    async create(profileData) {
      this.profile = await createProfile(profileData)
    },

    /**
     * Marks a user On-Boarding as complete
     */
    async markOnboardingComplete() {
      if (!this.profile) return
      await this.update({ id: this.profile.id, onboarding_complete: true })
    },
  },
})
