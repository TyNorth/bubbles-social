<template>
  <div v-for="comment in childComments" :key="comment.id" class="q-ml-lg q-mt-sm">
    <q-card class="bg-grey-9 text-white">
      <q-card-section>
        <div class="text-subtitle2 text-bold">{{ comment.username }}</div>
        <div class="text-caption text-grey-5 q-mb-xs">{{ formatDate(comment.created_at) }}</div>
        <div v-html="highlightMentions(comment.content)"></div>
      </q-card-section>

      <!-- Recursive replies -->
      <CommentThread
        :parent-id="comment.id"
        :allComments="allComments"
        :replying-to="replyingTo"
        :reply-text="replyText"
        :on-reply="onReply"
        :submit-reply="submitReply"
      />
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { parentId, allComments } = defineProps({
  parentId: String,
  allComments: Array,
  replyingTo: String,
  replyText: String,
  onReply: Function,
  submitReply: Function,
})

const childComments = computed(() =>
  Array.isArray(allComments) ? allComments.filter((c) => c.parent_id === parentId) : [],
)

function formatDate(date) {
  return new Date(date).toLocaleString()
}

function highlightMentions(text) {
  return text.replace(/@([a-zA-Z0-9_]+)/g, '<span style="color:#F35BC7">@$1</span>')
}

console.log('📦 allComments:', allComments)
</script>
