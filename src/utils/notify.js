import { Notify } from 'quasar'

/**
 * Show a simple notification
 * @param {string} message
 * @param {'positive'|'negative'|'warning'|'info'} type
 */
export function notify(message, type = 'info') {
  Notify.create({
    message,
    type,
    position: 'bottom',
    timeout: 3000,
    actions: type === 'negative' ? [{ label: 'Close', color: 'white' }] : undefined,
  })
}

/**
 * Shortcut for errors
 * @param {string|Error} error
 */
export function notifyError(error) {
  notify(typeof error === 'string' ? error : error.message || 'Something went wrong', 'negative')
}

/**
 * Shortcut for success messages
 * @param {string} message
 */
export function notifySuccess(message) {
  notify(message, 'positive')
}
