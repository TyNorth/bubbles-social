<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <!-- Top Header -->
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <!-- Hamburger -->
        <q-btn flat dense round icon="sym_o_menu" @click="toggleDrawer" />
        <q-btn
          v-show="
            router.currentRoute.value.path == '/explore' ||
            router.currentRoute.value.path == '/explore-field'
          "
          flat
          dense
          :icon="
            router.currentRoute.value.path == '/explore-field'
              ? 'sym_o_cards'
              : 'sym_o_bubble_chart'
          "
          :label="router.currentRoute.value.path == '/explore-field' ? 'Card View' : 'Bubble View'"
          @click="
            router.currentRoute.value.path == '/explore-field'
              ? router.push('/explore')
              : router.push('/explore-field')
          "
        />

        <q-toolbar-title>
          <span class="text-primary">BubbleNet</span>
        </q-toolbar-title>

        <!-- Top-right Actions -->
        <q-btn flat dense round icon="sym_o_notifications" @click="goToNotifications">
          <q-badge v-if="unreadCount > 0" color="red" floating>{{ unreadCount }}</q-badge>
        </q-btn>
        <q-btn flat dense round icon="sym_o_account_circle" @click="goToProfile" />
        <q-btn flat dense round icon="sym_o_logout" @click="handleAuthAction" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
      class="bg-grey-10 text-white column justify-between"
    >
      <q-list>
        <q-item clickable v-ripple to="/explore" exact>
          <q-item-section avatar><q-icon name="sym_o_explore" /></q-item-section>
          <q-item-section>Explore</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/profile" exact>
          <q-item-section avatar><q-icon name="sym_o_person" /></q-item-section>
          <q-item-section>My Profile</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/feed" exact>
          <q-item-section avatar><q-icon name="sym_o_dynamic_feed" /></q-item-section>
          <q-item-section>My Feed</q-item-section>
        </q-item>
      </q-list>

      <!-- Bottom Drawer Action -->
      <div class="q-pa-sm">
        <q-separator dark />
        <q-item clickable v-ripple @click="handleAuthAction">
          <q-item-section avatar><q-icon name="sym_o_logout" /></q-item-section>
          <q-item-section>Sign Out</q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { useNotificationStore } from 'stores/notification-store'

const notifications = useNotificationStore()
const unreadCount = computed(() => notifications.unread.length)

const drawerOpen = ref(false)
const router = useRouter()
//const isLoggedIn = ref(true)
const auth = useAuthStore()

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function goToNotifications() {
  router.push('/notifications')
}

function goToProfile() {
  router.push('/profile')
}

async function handleAuthAction() {
  try {
    await auth.logout()
    router.push('/login')
  } catch (err) {
    console.log(`error: ${err}`)
  }
}

console.log(router.currentRoute.value.path)
</script>

<style scoped>
.main-layout {
  background: #0f0f15;
}
</style>
