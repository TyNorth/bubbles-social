<template>
  <div>
    <div class="text-subtitle1 text-white q-mb-md">Posts by {{ user?.username }}</div>

    <div v-if="loading" class="text-grey text-center q-my-md">
      <q-spinner color="accent" size="32px" />
    </div>

    <div v-else-if="posts.length === 0" class="text-grey text-center q-my-md">
      {{ user?.username }} hasn't posted anything yet.
    </div>

    <div v-else class="q-gutter-y-md">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :profile="user"
        :username="user.username"
        :post-id="post.id"
        :content="post.content"
        :media-url="post.media_url"
        :tags="post.tags"
        :level-tag="post.level_tag"
        :created-at="post.created_at"
        :comment-count="post.comment_count || 0"
        :like-count="post.like_count || 0"
        :dislike-count="post.dislike_count || 0"
        :editable="auth.user.id === user.id"
        @comment="$emit('comment', post)"
        @view="$emit('view', post)"
        @edit="$emit('edit', post)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth-store'
import PostCard from 'components/PostCard.vue'

const props = defineProps({ user: Object })
const auth = useAuthStore()
const posts = ref([])
const loading = ref(true)

watch(
  () => props.user,
  async (user) => {
    if (!user?.id) return

    loading.value = true

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        interactions ( type ),
        comments ( id )
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
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

    loading.value = false
  },
  { immediate: true },
)
</script>
