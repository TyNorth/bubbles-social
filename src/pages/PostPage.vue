<template>
  <q-page class="q-pa-md">
    <PostCard
      v-if="post"
      :profile="post.profiles"
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

      <div v-for="comment in comments" :key="comment.id" class="q-mb-md">
        <q-card class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle2 text-bold">{{ comment.username }}</div>
            <div class="text-caption text-grey-5 q-mb-xs">{{ formatDate(comment.created_at) }}</div>
            <div>{{ comment.content }}</div>
          </q-card-section>
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
import { ref, onMounted, watch } from 'vue'
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
  })

  if (error) {
    notifyError(error)
  } else {
    notifySuccess('Comment posted!')
    newComment.value = ''
    await fetchComments()
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString()
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

const loadData = async () => {
  await fetchPost()
  await fetchComments()
}

onMounted(loadData)

watch(
  () => route.params.id,
  async () => {
    await loadData()
  },
)
</script>

<style scoped>
.q-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
