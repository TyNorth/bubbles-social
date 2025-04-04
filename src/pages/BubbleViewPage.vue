<template>
  <q-page class="q-pa-md">
    <BubbleHeader
      v-if="bubble"
      :name="bubble.name"
      :tags="bubble.tags"
      :level-tag="bubble.level_tag"
      :cover-image="bubble.cover_image"
    />
    <br />

    <!-- Posts -->
    <q-infinite-scroll @load="loadMore" :offset="100">
      <div class="q-gutter-y-md">
        <PostCard
          v-for="post in visiblePosts"
          :key="post.id"
          :profile="post.profiles"
          :username="post.username"
          :post-id="post.id"
          :content="post.content"
          :media-url="post.media_url"
          :tags="post.tags"
          :level-tag="post?.level_tag"
          :created-at="post.created_at"
          :comment-count="post.comment_count"
          :editable="auth.user.id === post.user_id"
          @like="() => toggleInteraction(post, 'like')"
          @dislike="() => toggleInteraction(post, 'dislike')"
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

    <!-- Floating Create Post Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn icon="sym_o_add" round color="accent" size="lg" @click="showCreateDialog = true" />
    </q-page-sticky>

    <!-- Fullscreen Post Editor Dialog -->
    <q-dialog v-model="showCreateDialog" maximized persistent>
      <q-card class="bg-dark text-white">
        <q-bar>
          <div class="text-h6">New Post</div>
          <q-space />
          <q-btn dense flat icon="sym_o_close" v-close-popup />
        </q-bar>

        <q-card-section>
          <q-editor
            dark
            v-model="newPostContent"
            min-height="200px"
            height="auto"
            label="What's on your mind?"
            placeholder="Type your comment here. Drop Media here."
            :definitions="{
              media: {
                icon: 'sym_o_upload',
                label: 'Upload Media',
                tip: 'Upload image or video',
                handler: openFilePicker,
              },
            }"
            @drop.prevent="handleMediaDrop"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['hr', 'link', 'unordered', 'ordered'],
              ['media'], // custom action!
              ['fullscreen'],
            ]"
            class="q-mb-md text-black dropzone"
          />

          <input
            type="file"
            ref="fileInputRef"
            style="display: none"
            accept="image/*,video/*"
            @change="handleFileChange"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            label="Post"
            color="primary"
            @click="submitPost"
            :disable="!newPostContent.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { updatePost, getPostsByBubble, createPost } from 'src/db/posts'
import { uploadPostMedia } from 'src/db/storage'

const showCreateDialog = ref(false)
const newPostContent = ref('')
const auth = useAuthStore()
const interactionStore = useInteractionStore()
const route = useRoute()
const router = useRouter()

const bubble = ref(null)
const posts = ref([])
const visiblePosts = ref([])
const pageSize = 10
const page = ref(1)
const fileInputRef = ref(null)

function openFilePicker() {
  fileInputRef.value?.click()
}

async function handleFileChange(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  for (const file of files) {
    try {
      const url = await uploadPostMedia(file, auth.user.id)
      embedMedia(url)
    } catch (err) {
      notifyError('Upload failed: ' + err.message)
    }
  }

  // reset the input to allow re-selection of same file
  event.target.value = null
}

function embedMedia(url) {
  if (url.endsWith('.mp4')) {
    newPostContent.value += `<video controls width="100%"><source src="${url}" type="video/mp4"></video><br/>`
  } else {
    newPostContent.value += `<img src="${url}" style="max-width: 100%;" /><br/>`
  }
}

async function handleMediaDrop(event) {
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  for (const file of files) {
    try {
      const url = await uploadPostMedia(file, auth.user.id)

      const tag = file.type.startsWith('video/')
        ? `<video controls style="max-width:100%"><source src="${url}" type="${file.type}" /></video>`
        : `<img src="${url}" alt="media" style="max-width:100%" />`

      newPostContent.value += `\n${tag}\n`
    } catch (err) {
      notifyError('Upload failed: ' + err.message)
    }
  }
}

async function submitPost() {
  try {
    await createPost({
      user_id: auth.user.id,
      bubble_id: route.params.id,
      content: newPostContent.value.trim(),
      tags: [],
      level_tag: 'beginner',
    })

    notifySuccess('Post created!')
    newPostContent.value = ''
    showCreateDialog.value = false
    await fetchPosts()
  } catch (err) {
    notifyError(err)
  }
}

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

async function toggleInteraction(post, type) {
  try {
    const result = await interactionStore.toggle({
      userId: auth.user.id,
      postId: post.id,
      type,
    })

    const actionText =
      type === 'like'
        ? result.result === 'added'
          ? 'Liked!'
          : 'Like removed.'
        : result.result === 'added'
          ? 'Disliked.'
          : 'Dislike removed.'

    notifySuccess(actionText)
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

onMounted(async () => {
  await fetchBubble()
  await fetchPosts()
  await interactionStore.fetchByUser(auth.user.id)
})
</script>
<style scoped>
.dropzone {
  border: 2px dashed transparent;
}
.dropzone:hover {
  border-color: #4dabf7;
}
</style>
