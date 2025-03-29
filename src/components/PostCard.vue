<template>
  <q-card class="post-card q-mb-md" flat bordered>
    <!-- Header: profile + timestamp -->
    <q-card-section class="row items-center q-gutter-sm">
      <q-avatar size="32px" class="bg-grey-8">
        <img :src="profile.avatar_url" v-if="profile?.avatar_url" />
        <span v-else>{{ profileInitial }}</span>
      </q-avatar>

      <div class="column">
        <div class="text-weight-bold text-white">{{ profile.username }}</div>
        <div class="text-caption text-grey-5">{{ formattedDate }}</div>
      </div>
    </q-card-section>

    <!-- Content: text + optional image -->
    <q-card-section>
      <div class="text-body1 text-white q-mb-sm" v-if="content">{{ content }}</div>

      <q-img
        v-if="mediaUrl"
        :src="mediaUrl"
        class="post-image q-mb-sm"
        ratio="16/9"
        spinner-color="accent"
      />
    </q-card-section>

    <!-- Tags / level -->
    <q-card-section class="q-pt-none q-pb-sm">
      <q-chip
        v-if="levelTag"
        label="Level: {{ levelTag }}"
        color="accent"
        text-color="white"
        dense
        square
      />
      <q-chip
        v-for="tag in tags"
        :key="tag"
        :label="tag"
        color="primary"
        text-color="white"
        dense
        class="q-mr-xs"
      />
    </q-card-section>

    <!-- Actions -->
    <q-separator />
    <q-card-actions align="between">
      <q-btn v-if="editable" flat dense icon="sym_o_edit" color="grey-4" @click="emit('edit')" />

      <q-btn flat dense icon="sym_o_favorite" :label="likeCount || ''" @click="like" color="red" />
      <q-btn
        flat
        dense
        icon="sym_o_heart_broken"
        :label="dislikeCount || ''"
        @click="dislike"
        color="pink"
      />

      <q-btn
        flat
        dense
        icon="sym_o_comment"
        :label="commentCount || ''"
        @click="comment"
        color="grey-4"
      />
      <q-btn flat dense icon="sym_o_visibility" @click="view" color="grey-4" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps({
  profile: Object,
  content: String,
  mediaUrl: String,
  tags: Array,
  levelTag: String,
  createdAt: String,
  likeCount: Number,
  dislikeCount: Number,
  commentCount: Number,
  editable: Boolean,
})

const emit = defineEmits(['like', 'dislike', 'comment', 'view', 'edit'])

const formattedDate = computed(() =>
  formatDistanceToNow(new Date(props.createdAt), { addSuffix: true }),
)

const profileInitial = computed(() => props.profile?.username?.charAt(0)?.toUpperCase() || 'U')

function like() {
  emit('like')
}

function dislike() {
  emit('dislike')
}

function comment() {
  emit('comment')
}

function view() {
  emit('view')
}
</script>

<style scoped>
.post-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.post-image {
  border-radius: 12px;
  object-fit: cover;
}
</style>
