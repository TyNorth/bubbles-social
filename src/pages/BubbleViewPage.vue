<template>
  <q-page class="q-pa-md">
    <BubbleHeader
      v-if="bubble"
      :name="bubble.name"
      :tags="bubble.tags"
      :level-tag="bubble.level_tag"
      :cover-image="bubble.cover_image"
    />

    <!-- Posts -->
    <q-infinite-scroll @load="loadMore" :offset="100">
      <div class="q-gutter-y-md">
        <PostCard
          v-for="post in visiblePosts"
          :key="post.id"
          :profile="post.profiles"
          :content="post.content"
          :media-url="post.media_url"
          :tags="post.tags"
          :level-tag="post.level_tag"
          :created-at="post.created_at"
          :like-count="post.like_count"
          :dislike-count="post.dislike_count"
          :editable="auth.user.id === post.user_id"
          @like="() => likePost(post)"
          @dislike="() => dislikePost(post)"
          @comment="() => commentPost(post)"
          @view="() => viewPost(post)"
          @edit="() => editPost(post)"
        />
      </div>

      <template v-slot:loading>
        <div class="text-center q-my-md">
          <q-spinner-dots color="accent" size="32px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import BubbleHeader from 'components/BubbleHeader.vue'
import PostCard from 'components/PostCard.vue'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { useAuthStore } from 'stores/auth-store'
import { useInteractionStore } from 'stores/interaction-store'
import { Dialog } from 'quasar'
import { updatePost, getPostsByBubble } from 'src/db/posts'

const auth = useAuthStore()
const interactionStore = useInteractionStore()
const route = useRoute()
const router = useRouter()

const bubble = ref(null)
const posts = ref([])
const visiblePosts = ref([])
const pageSize = 10
const page = ref(1)

async function fetchBubble() {
  const { data, error } = await supabase
    .from('bubbles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    notifyError(error)
    router.push('/explore')
  } else {
    bubble.value = data
  }
}

async function fetchPosts() {
  try {
    const data = await getPostsByBubble(route.params.id)
    posts.value = data
    visiblePosts.value = data.slice(0, pageSize)
  } catch (error) {
    notifyError(`fetch error ${error.message}`)
  }
}

function loadMore(done) {
  page.value++
  const limit = page.value * pageSize
  visiblePosts.value = posts.value.slice(0, limit)
  setTimeout(done, 300)
}

// 🔁 Toggle like/dislike using the store
async function likePost(post) {
  try {
    const { result, hadBefore, hadOpposite } = await interactionStore.toggle({
      userId: auth.user.id,
      postId: post.id,
      type: 'like',
    })

    if (result === 'added' && !hadBefore) {
      updateInteractionCount(post.id, 'like', 1)
      if (hadOpposite) updateInteractionCount(post.id, 'dislike', -1)
    } else if (result === 'removed') {
      updateInteractionCount(post.id, 'like', -1)
    }

    notifySuccess(result === 'added' ? 'Liked!' : 'Like removed.')
  } catch (err) {
    notifyError(err)
  }
}

async function dislikePost(post) {
  try {
    const { result, hadBefore, hadOpposite } = await interactionStore.toggle({
      userId: auth.user.id,
      postId: post.id,
      type: 'dislike',
    })

    if (result === 'added' && !hadBefore) {
      updateInteractionCount(post.id, 'dislike', 1)
      if (hadOpposite) updateInteractionCount(post.id, 'like', -1)
    } else if (result === 'removed') {
      updateInteractionCount(post.id, 'dislike', -1)
    }

    notifySuccess(result === 'added' ? 'Disliked.' : 'Dislike removed.')
  } catch (err) {
    notifyError(err)
  }
}

function commentPost(post) {
  router.push({ path: `/post/${post.id}`, query: { focus: 'comments' } })
}

function viewPost(post) {
  router.push(`/post/${post.id}`)
}

function editPost(post) {
  Dialog.create({
    title: 'Edit Post',
    message: 'Update your post content below:',
    prompt: {
      model: post.content,
      type: 'textarea',
    },
    cancel: true,
    persistent: true,
  }).onOk(async (newContent) => {
    try {
      await updatePost(post.id, { content: newContent })
      notifySuccess('Post updated!')
      await fetchPosts()
    } catch (err) {
      notifyError(err)
    }
  })
}

function updateInteractionCount(postId, type, delta) {
  const post = posts.value.find((p) => p.id === postId)
  if (!post) return

  if (type === 'like') post.like_count += delta
  if (type === 'dislike') post.dislike_count += delta
}

onMounted(async () => {
  await fetchBubble()
  await fetchPosts()
  await interactionStore.fetchByUser(auth.user.id)
})
</script>
