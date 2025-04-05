<template>
  <div class="profile-header q-pa-md row items-center q-gutter-md">
    <q-avatar size="64px" class="bg-grey-8">
      <img :src="props.user?.avatar_url" v-if="props.user?.avatar_url" />
      <span v-else>{{ userInitial }}</span>
    </q-avatar>

    <div class="column">
      <div class="text-h5 text-white">{{ props.user?.username }}</div>
      <div v-if="props.user?.bio" class="text-subtitle2 text-grey-4 q-mt-xs">
        {{ props.user?.bio }}
      </div>
      <div class="text-caption text-grey q-mt-xs">Joined {{ joinedDate }}</div>
    </div>

    <q-space />

    <q-btn
      v-if="isCurrentUser"
      label="Edit Profile"
      color="accent"
      flat
      dense
      icon="sym_o_edit"
      @click="emit('edit')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  user: Object,
  isCurrentUser: Boolean,
})

const emit = defineEmits(['edit'])

const userInitial = computed(() => props.user?.username?.charAt(0)?.toUpperCase() || 'U')

const joinedDate = computed(() =>
  props.user?.created_at ? format(new Date(props.user.created_at), 'MMMM yyyy') : '',
)
</script>

<style scoped>
.profile-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
