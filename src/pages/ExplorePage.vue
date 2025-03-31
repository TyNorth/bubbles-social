<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-white q-mb-sm">Explore Bubbles</div>
    <div class="text-subtitle2 text-grey-4 q-mb-md">
      Step into new perspectives, topics, and vibes.
    </div>

    <!-- Search -->
    <q-input
      dark
      v-model="search"
      filled
      dense
      debounce="300"
      placeholder="🔍 Search bubbles..."
      class="q-mb-md"
      :prefix="search ? '🔍' : ''"
      clearable
      clear-icon="sym_o_clear"
    />

    <!-- Tag Filters -->
    <div class="row q-col-gutter-sm q-mb-md">
      <q-chip
        v-for="tag in allTags"
        :key="tag"
        :label="tag"
        clickable
        color="secondary"
        text-color="white"
        :outline="!selectedTags.includes(tag)"
        @click="toggleTag(tag)"
      />
    </div>

    <!-- Sort Controls -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle2 text-white">Sort by:</div>
      <q-btn-group spread flat>
        <q-btn
          v-for="option in ['trending', 'new', 'nearby']"
          :key="option"
          :label="option.charAt(0).toUpperCase() + option.slice(1)"
          flat
          :color="sortOption === option ? 'primary' : 'grey-5'"
          @click="sortOption = option"
        />
      </q-btn-group>
    </div>

    <!-- Infinite Scroll -->
    <q-infinite-scroll @load="loadMore" :offset="150">
      <div class="row q-col-gutter-md">
        <div
          v-for="bubble in visibleBubbles"
          :key="bubble.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <BubbleCard
            :name="bubble.name"
            :description="bubble.description"
            :tags="bubble.tags"
            :cover-image="bubble.cover_image"
            :joined="joinedBubbles.includes(bubble.id)"
            @peek="() => peekBubble(bubble)"
            @enter="() => enterBubble(bubble)"
            @click="() => viewBubble(bubble)"
          />
        </div>
      </div>

      <template v-slot:loading>
        <div class="text-center q-my-md">
          <q-spinner-dots color="accent" size="32px" />
        </div>
      </template>
    </q-infinite-scroll>

    <!-- No Results -->
    <q-banner
      v-if="filteredBubbles.length === 0"
      class="bg-grey-10 text-grey-4 q-mt-lg"
      rounded
      dense
    >
      No bubbles match your search.
    </q-banner>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBubbleStore } from 'stores/bubble-store'
import { useAuthStore } from 'stores/auth-store'
import { notifySuccess, notifyError } from 'src/utils/notify'
import BubbleCard from 'components/BubbleCard.vue'

const router = useRouter()
const auth = useAuthStore()
const bubbleStore = useBubbleStore()

const search = ref('')
const selectedTags = ref([])

const allTags = computed(() => {
  const tags = new Set()
  bubbleStore.all.forEach((b) => {
    if (Array.isArray(b.tags)) {
      b.tags.forEach((tag) => tags.add(tag))
    }
  })
  return [...tags]
})

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
}

const filteredBubbles = computed(() => {
  let result = bubbleStore.all

  if (selectedTags.value.length > 0) {
    result = result.filter((b) => selectedTags.value.every((tag) => b.tags?.includes(tag)))
  }

  if (search.value) {
    result = result.filter((b) => b.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  return result
})

const sortOption = ref('trending')

const sortedBubbles = computed(() => {
  const list = [...filteredBubbles.value]

  switch (sortOption.value) {
    case 'new':
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'trending':
      return list.sort((a, b) => (b.join_count || 0) - (a.join_count || 0))
    case 'nearby':
      return list // Future logic for geo-based sorting
    default:
      return list
  }
})

const pageSize = 12
const currentPage = ref(1)
const visibleBubbles = ref([])

watch(
  [sortedBubbles, currentPage],
  () => {
    const limit = currentPage.value * pageSize
    visibleBubbles.value = sortedBubbles.value.slice(0, limit)
  },
  { immediate: true },
)

function loadMore(done) {
  currentPage.value++
  setTimeout(done, 300)
}

watch([search, selectedTags, sortOption], () => {
  currentPage.value = 1
})

const joinedBubbles = computed(() => bubbleStore.myBubbles)

async function peekBubble(bubble) {
  notifySuccess(`Peeking into "${bubble.name}"...`)
  router.push(`/bubble/${bubble.id}`)
}

async function enterBubble(bubble) {
  try {
    const alreadyJoined = joinedBubbles.value.includes(bubble.id)
    if (!alreadyJoined) {
      await bubbleStore.join(auth.user.id, bubble.id)
      notifySuccess(`You joined "${bubble.name}"`)
    }

    // Always enter (even if already joined)
    router.push(`/bubble/${bubble.id}`)
  } catch (err) {
    notifyError(err)
  }
}

async function viewBubble(bubble) {
  try {
    const alreadyJoined = joinedBubbles.value.includes(bubble.id)
    if (!alreadyJoined) {
      await bubbleStore.join(auth.user.id, bubble.id)
      notifySuccess(`You joined "${bubble.name}"`)
    }

    // Always enter (even if already joined)
    router.push(`/bubble/${bubble.id}`)
  } catch (err) {
    notifyError(err)
  }
}

onMounted(async () => {
  await bubbleStore.fetchAll()
  await bubbleStore.fetchMyBubbles(auth.user.id)
})
</script>
<style></style>
