import { LoadingBar } from 'quasar'

/**
 * Start the loading bar
 */
export function startLoading() {
  LoadingBar.start()
}

/**
 * Stop the loading bar
 */
export function stopLoading() {
  LoadingBar.stop()
}

/**
 * Fail the loading bar
 */
export function failLoading() {
  LoadingBar.stop()
  LoadingBar.setDefaults({ color: 'negative' })
}
