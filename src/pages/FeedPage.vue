<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-white q-mb-md">Your Feed</div>

    <!-- Sidebar -->
    <div class="col-auto q-pr-md" style="min-width: 180px">
      <div class="text-subtitle2 text-grey-5 q-mb-sm">Trending Tags</div>
      <q-chip
        v-if="activeFeedTags.length > 0"
        label="Clear"
        color="grey-7"
        size="sm"
        text-color="white"
        icon="sym_o_close"
        clickable
        @click="activeFeedTags = []"
      />
      <q-chip
        v-for="tag in trendingTags"
        :key="tag"
        clickable
        size="sm"
        color="accent"
        text-color="white"
        class="q-mb-xs"
        @click="toggleFeedTag(tag)"
        :outline="!activeFeedTags.includes(tag)"
      >
        {{ tag }}
      </q-chip>
    </div>

    <div v-if="sortedPosts.length === 0" class="text-grey-5 text-subtitle2 q-mt-md">
      No posts match your interests yet.
    </div>

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
          :like-count="post.like_count"
          :dislike-count="post.dislike_count"
          :comment-count="post.comment_count"
          :editable="auth.user.id === post.user_id"
          @comment="() => commentPost(post)"
          @view="() => viewPost(post)"
          @edit="() => editPost(post)"
        />
      </div>
    </q-infinite-scroll>

    <EditPostDialog
      v-model="showEditDialog"
      :content="editingPost?.content"
      :post-id="editingPost?.id"
      @updated="handlePostUpdate"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth-store'
import { useBubbleStore } from 'stores/bubble-store'
import PostCard from 'components/PostCard.vue'
import EditPostDialog from 'components/EditPostDialog.vue'
import { notifySuccess } from 'src/utils/notify'
import { updatePost } from 'src/db/posts'

const auth = useAuthStore()
const bubbleStore = useBubbleStore()
const posts = ref([])
const visiblePosts = ref([])
const page = ref(1)
const pageSize = 10

const activeFeedTags = ref([])

// Load user interest + joined bubbles
const interestTags = ref([])
const joinedBubbleIds = computed(() => bubbleStore.myBubbles)
const showEditDialog = ref(false)
const editingPost = ref(null)

function editPost(post) {
  editingPost.value = post
  showEditDialog.value = true
}

async function handlePostUpdate({ postId, content }) {
  await updatePost(postId, { content })
  notifySuccess('Post updated!')
  await loadFeedPosts()
}

async function loadUserProfileTags() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('interest_tags')
    .eq('user_id', auth.user.id)
    .single()

  if (!error) {
    interestTags.value = data.interest_tags || []
  }
}

const trendingTags = computed(() => {
  const tagCounts = {}
  posts.value.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 8)
})

async function loadFeedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    *,
    profiles ( id, username, avatar_url ),
    interactions (
      type
    ),
    comments ( id )
  `,
    )
    .order('created_at', { ascending: false })

  if (!error && data) {
    // Enrich each post with like/dislike/comment count
    posts.value = data.map((post) => {
      const likes = post.interactions?.filter((i) => i.type === 'like') || []
      const dislikes = post.interactions?.filter((i) => i.type === 'dislike') || []
      const comments = post.comments || []

      return {
        ...post,
        like_count: likes.length,
        dislike_count: dislikes.length,
        comment_count: comments.length,
      }
    })
  }
}

function scorePost(post) {
  let score = 0
  if (joinedBubbleIds.value.includes(post.bubble_id)) score += 5
  if (interestTags.value.some((tag) => post.tags?.includes(tag))) score += 3
  if (post.like_count) score += post.like_count * 0.5
  if (post.comment_count) score += post.comment_count * 0.3
  return score
}

//const sortedPosts = computed(() => [...posts.value].sort((a, b) => scorePost(b) - scorePost(a)))

function loadMore(done) {
  const limit = page.value * pageSize
  visiblePosts.value = sortedPosts.value.slice(0, limit)
  page.value++
  setTimeout(done, 300)
}

function toggleFeedTag(tag) {
  const i = activeFeedTags.value.indexOf(tag)
  if (i >= 0) activeFeedTags.value.splice(i, 1)
  else activeFeedTags.value.push(tag)
}

// Filter feed posts by active tags (optional enhancement)
const filteredPosts = computed(() => {
  if (activeFeedTags.value.length === 0) return posts.value
  return posts.value.filter((p) => p.tags?.some((t) => activeFeedTags.value.includes(t)))
})

// Then score + sort
const sortedPosts = computed(() =>
  [...filteredPosts.value].sort((a, b) => scorePost(b) - scorePost(a)),
)

watch(sortedPosts, () => {
  page.value = 1
  visiblePosts.value = sortedPosts.value.slice(0, pageSize)
})

onMounted(async () => {
  await loadUserProfileTags()
  await bubbleStore.fetchMyBubbles(auth.user.id)
  await loadFeedPosts()
  loadMore(() => {})
})
</script>
