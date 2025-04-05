<template>
  <q-page class="q-pa-none">
    <ProfileHeader :user="user" :isCurrentUser="isCurrentUser" />

    <div class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        align="left"
        dense
        class="text-white bg-transparent q-mb-md"
        active-color="primary"
        indicator-color="accent"
        shrink
        narrow-indicator
      >
        <q-tab name="posts" label="Posts" />
        <q-tab v-if="isCurrentUser" name="saves" label="Saves" />
        <q-tab name="bubbles" label="Bubbles" />
        <q-tab name="activity" label="Activity" />
        <q-tab name="about" label="About" />
      </q-tabs>

      <q-separator spaced />

      <ProfileTabContent :tab="activeTab" :user="user" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { supabase } from 'boot/supabase'

import ProfileHeader from 'components/ProfileHeader.vue'
import ProfileTabContent from 'components/ProfileTabContent.vue'

const auth = useAuthStore()
const route = useRoute()

const user = ref(null)
const activeTab = ref('posts')

const isCurrentUser = computed(() => {
  return route.params.id === auth.user?.id || route.path === '/profile'
})

onMounted(async () => {
  const id = route.params.id || auth.user?.id

  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()

  if (!error) {
    user.value = data
  }
  console.log(user.value)
})
</script>
