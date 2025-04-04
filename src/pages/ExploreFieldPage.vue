<template>
  <q-page class="q-pa-md bg-dark text-white">
    <div class="text-h4 q-mb-md">Bubble Field</div>

    <div class="q-mb-md">
      <q-input
        dark
        filled
        v-model="search"
        dense
        debounce="300"
        placeholder="🔍 Search bubbles..."
        class="q-mb-sm"
        clearable
      />
      <div class="row q-col-gutter-sm">
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
    </div>

    <BubbleField
      :bubbles="filteredBubbles"
      :joined-bubbles="joinedBubbles"
      :filter-tags="selectedTags"
      @click="handleBubbleClick"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBubbleStore } from 'stores/bubble-store'
import { useAuthStore } from 'stores/auth-store'
import BubbleField from 'components/BubbleField.vue'

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

const joinedBubbles = computed(() => bubbleStore.myBubbles)

function handleBubbleClick(bubble) {
  if (!joinedBubbles.value.includes(bubble.id)) {
    bubbleStore.join(auth.user.id, bubble.id)
  }
  router.push(`/bubble/${bubble.id}`)
}

onMounted(async () => {
  await bubbleStore.fetchAll()
  await bubbleStore.fetchMyBubbles(auth.user.id)
})
</script>
