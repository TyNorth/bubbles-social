import { defineStore } from 'pinia'
import { Dark, Platform, AppFullscreen, Notify } from 'quasar'

export const useUIStore = defineStore('ui', {
  state: () => ({
    darkMode: Dark.isActive,
    loadingGlobal: false,
    activeDialog: null,
    sidebarOpen: true,
    isMobile: Platform.is.mobile,
    fullscreen: AppFullscreen.isActive,
  }),

  actions: {
    toggleDark() {
      this.darkMode = !this.darkMode
      Dark.set(this.darkMode)
    },
    setDark(val) {
      this.darkMode = val
      Dark.set(val)
    },
    setLoading(val) {
      this.loadingGlobal = val
    },
    openDialog(name) {
      this.activeDialog = name
    },
    closeDialog() {
      this.activeDialog = null
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setFullscreen(val) {
      this.fullscreen = val
      val ? AppFullscreen.request() : AppFullscreen.exit()
    },
    showToast(message, type = 'info') {
      Notify.create({
        message,
        type,
        timeout: 3000,
        position: 'bottom',
      })
    },
  },
})
