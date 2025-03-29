import { Cookies } from 'quasar'

/**
 * Set a cookie
 * @param {string} name
 * @param {any} value
 * @param {object} options
 */
export function setCookie(name, value, options = { expires: 365 }) {
  Cookies.set(name, value, options)
}

/**
 * Get a cookie
 * @param {string} name
 * @returns {any}
 */
export function getCookie(name) {
  return Cookies.get(name)
}

/**
 * Remove a cookie
 * @param {string} name
 */
export function removeCookie(name) {
  Cookies.remove(name)
}
