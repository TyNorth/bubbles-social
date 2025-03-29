import { Dark } from 'quasar'

/**
 * Toggle dark mode
 */
export function toggleDark() {
  Dark.toggle()
}

/**
 * Set dark mode explicitly
 * @param {boolean} enable
 */
export function setDark(enable) {
  Dark.set(enable)
}

/**
 * Get current dark mode state
 * @returns {boolean}
 */
export function isDark() {
  return Dark.isActive
}
