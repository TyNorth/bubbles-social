<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-white q-mb-md">Notifications</div>

    <q-list bordered class="rounded-borders bg-grey-9 text-white">
      <q-item
        v-for="n in notifications"
        :key="n.id"
        clickable
        @click="handleNotificationClick(n)"
        :class="{ 'bg-grey-10': !n.read }"
      >
        <q-item-section avatar>
          <q-icon :name="iconForType(n.type)" :color="colorForType(n.type)" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ labelForType(n.type) }}</q-item-label>
          <q-item-label caption>{{ n.metadata?.preview || '...' }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="sym_o_arrow_forward" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useNotificationStore } from 'stores/notification-store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const notificationsStore = useNotificationStore()
const router = useRouter()

const notifications = computed(() => notificationsStore.notifications)

const iconForType = (type) => {
  return (
    {
      mention: 'sym_o_alternate_email',
      reply: 'sym_o_reply',
      like: 'sym_o_favorite',
    }[type] || 'sym_o_notifications'
  )
}

const colorForType = (type) => {
  return (
    {
      mention: 'pink',
      reply: 'primary',
      like: 'red',
    }[type] || 'grey'
  )
}

const labelForType = (type) => {
  return (
    {
      mention: 'You were mentioned',
      reply: 'You got a reply',
      like: 'Someone liked your post',
    }[type] || 'New notification'
  )
}

async function handleNotificationClick(n) {
  await notificationsStore.markRead(n.id)

  const postId = n.metadata?.postId || n.related_id
  if (postId) {
    router.push(`/post/${postId}`)
  }
}

onMounted(async () => {
  await notificationsStore.fetch(auth.user.id)
})
</script>
