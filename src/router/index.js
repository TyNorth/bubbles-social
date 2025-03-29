import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

import routes from './routes'

import { useAuthStore } from 'stores/auth-store'
import { useProfileStore } from 'stores/profile-store'
import { useBubbleStore } from 'stores/bubble-store'
import { isOnboardingComplete } from 'src/utils/onboarding-utils' // create this if not already

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()
    const profile = useProfileStore()
    const bubbles = useBubbleStore()

    if (!auth.loaded) {
      await auth.fetchUser()
    }

    const isAuth = !!auth.user
    const isSetupRoute = to.path.startsWith('/setup')

    if (!isAuth && !to.meta.public) {
      return next('/login')
    }

    if (isAuth && !profile.profile) {
      await profile.fetchProfile(auth.user.id)
      await bubbles.fetchMyBubbles(auth.user.id)
    }

    const done = isOnboardingComplete(profile.profile, bubbles.myBubbles)

    if (isAuth && !done && !isSetupRoute) {
      return next('/setup')
    }

    if (isAuth && done && isSetupRoute) {
      return next('/explore')
    }

    return next()
  })

  return Router
})
