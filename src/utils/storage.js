import { LocalStorage } from 'quasar'

/**
 * Set a value in local storage
 * @param {string} key
 * @param {any} value
 */
export function setLocal(key, value) {
  LocalStorage.set(key, value)
}

/**
 * Get a value from local storage
 * @param {string} key
 * @returns {any}
 */
export function getLocal(key) {
  return LocalStorage.getItem(key)
}

/**
 * Remove a value from local storage
 * @param {string} key
 */
export function removeLocal(key) {
  LocalStorage.remove(key)
}
