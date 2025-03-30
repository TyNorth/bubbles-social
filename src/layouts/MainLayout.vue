<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <!-- Top Header -->
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <!-- Hamburger -->
        <q-btn flat dense round icon="sym_o_menu" @click="toggleDrawer" />

        <q-toolbar-title>
          <span class="text-primary">BubbleNet</span>
        </q-toolbar-title>

        <!-- Top-right Actions -->
        <q-btn flat dense round icon="sym_o_notifications" @click="goToNotifications" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawerOpen = ref(false)
const router = useRouter()
const isLoggedIn = ref(true)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function goToNotifications() {
  router.push('/notifications')
}

function goToProfile() {
  router.push('/profile')
}

function handleAuthAction() {
  if (isLoggedIn.value) {
    // Perform logout
    console.log('Logging out...')
    isLoggedIn.value = false
    router.push('/login')
  } else {
    // Perform sign-in
    router.push('/login')
  }
}
</script>

<style scoped>
.main-layout {
  background: #0f0f15;
}
</style>
