import { Platform } from 'quasar'

/**
 * Check if the app is running on mobile
 * @returns {boolean}
 */
export function isMobile() {
  return Platform.is.mobile
}

/**
 * Check if running in PWA mode
 * @returns {boolean}
 */
export function isPWA() {
  return Platform.is.pwa
}

/**
 * Get full platform info object
 * @returns {object}
 */
export function getPlatform() {
  return Platform
}
