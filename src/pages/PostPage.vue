<template>
  <q-page class="q-pa-md">
    <PostCard
      v-if="post"
      :profile="post.profiles"
      :username="post.username"
      :content="post.content"
      :media-url="post.media_url"
      :tags="post.tags"
      :level-tag="post.level_tag"
      :created-at="post.created_at"
      :like-count="post.like_count"
      :dislike-count="post.dislike_count"
      :comment-count="post.comment_count"
      :editable="auth.user.id === post.user_id"
      @like="() => likePost(post)"
      @dislike="() => dislikePost(post)"
      @edit="() => editPost(post)"
    />

    <q-separator class="q-my-lg" />

    <div>
      <div class="text-h6 text-white q-mb-md">Comments</div>

      <div v-for="comment in rootComments" :key="comment.id" class="q-mb-md">
        <q-card class="bg-grey-10 text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-bold">{{ comment.username }}</div>
            <div class="text-caption text-grey-5 q-mb-xs">{{ formatDate(comment.created_at) }}</div>
            <div v-html="highlightMentions(comment.content)"></div>
            <q-btn
              dense
              flat
              size="sm"
              color="primary"
              class="q-mt-xs"
              @click="replyingTo = comment.id"
              >Reply</q-btn
            >
          </q-card-section>

          <div v-if="replyingTo === comment.id" class="q-pa-sm">
            <q-form @submit.prevent="submitReply(comment.id)">
              <q-input
                filled
                v-model="replyText"
                label="Write a reply..."
                dense
                autogrow
                class="q-mb-sm"
              />
              <q-btn label="Reply" type="submit" color="accent" size="sm" />
            </q-form>
          </div>

          <div v-for="child in repliesFor(comment.id)" :key="child.id" class="q-ml-lg q-mt-sm">
            <q-card class="bg-grey-9 text-white">
              <q-card-section>
                <div class="text-subtitle2 text-bold">{{ child.username }}</div>
                <div class="text-caption text-grey-5 q-mb-xs">
                  {{ formatDate(child.created_at) }}
                </div>
                <div v-html="highlightMentions(child.content)"></div>
              </q-card-section>
            </q-card>
          </div>
        </q-card>
      </div>

      <q-form @submit.prevent="submitComment">
        <q-input
          filled
          v-model="newComment"
          label="Write a comment..."
          type="textarea"
          autogrow
          class="q-mb-sm"
        />
        <q-btn label="Post Comment" type="submit" color="primary" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'boot/supabase'
import PostCard from 'components/PostCard.vue'
import { useAuthStore } from 'stores/auth-store'
import { notifySuccess, notifyError } from 'src/utils/notify'
import { getPostById } from 'src/db/posts'

const auth = useAuthStore()
const route = useRoute()

const post = ref(null)
const comments = ref([])
const newComment = ref('')
const replyText = ref('')
const replyingTo = ref(null)

async function fetchPost() {
  try {
    post.value = await getPostById(route.params.id)
  } catch (err) {
    notifyError(err)
  }
}

async function fetchComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', route.params.id)
    .order('created_at', { ascending: true })

  if (error) notifyError(error)
  else comments.value = data
}

async function submitComment() {
  if (!newComment.value.trim()) return

  const { error } = await supabase.from('comments').insert({
    post_id: route.params.id,
    user_id: auth.user.id,
    content: newComment.value.trim(),
    parent_id: null,
  })

  if (error) {
    notifyError(error)
  } else {
    notifySuccess('Comment posted!')
    newComment.value = ''
    await fetchComments()
  }
}

async function submitReply(parentId) {
  if (!replyText.value.trim()) return

  const { error } = await supabase.from('comments').insert({
    post_id: route.params.id,
    user_id: auth.user.id,
    content: replyText.value.trim(),
    parent_id: parentId,
  })

  if (error) {
    notifyError(error)
  } else {
    notifySuccess('Reply posted!')
    replyText.value = ''
    replyingTo.value = null
    await fetchComments()
  }
}

const rootComments = computed(() => comments.value.filter((c) => !c.parent_id))
function repliesFor(parentId) {
  return comments.value.filter((c) => c.parent_id === parentId)
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

function highlightMentions(text) {
  return text.replace(/@([a-zA-Z0-9_]+)/g, '<span style="color:#F35BC7">@$1</span>')
}

async function likePost(post) {
  // hook to interaction store or db
}

async function dislikePost(post) {
  // hook to interaction store or db
}

function editPost(post) {
  // hook to edit logic
}

onMounted(async () => {
  await fetchPost()
  await fetchComments()
})
</script>

<style scoped>
.q-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
