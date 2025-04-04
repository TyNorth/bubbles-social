<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-white q-mb-md">Let’s get you started</div>

    <!-- Step 1: Tag Selection -->
    <div class="q-mb-md">
      <div class="text-subtitle1 text-white">What topics interest you?</div>
      <div class="q-gutter-sm q-mt-sm">
        <q-chip
          v-for="tag in allTags"
          :key="tag"
          clickable
          :label="tag"
          :color="selectedTags.includes(tag) ? 'primary' : 'grey-8'"
          text-color="white"
          @click="toggleTag(tag)"
        />
      </div>
    </div>

    <!-- Step 2: Suggested Bubbles -->
    <div>
      <div class="text-subtitle1 text-white q-mb-sm">Suggested Bubbles</div>
      <div class="row q-col-gutter-md">
        <div v-for="bubble in filteredBubbles" :key="bubble.id" class="col-12 col-sm-6 col-md-4">
          <BubbleCard
            :name="bubble.name"
            :description="bubble.description"
            :tags="bubble.tags"
            :joined="selectedBubbles.includes(bubble.id)"
            @click="toggleBubble(bubble.id)"
          />
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="q-mt-lg">
      <q-btn
        label="Join & Continue"
        color="primary"
        :disable="selectedTags.length < 2 || selectedBubbles.length < 1"
        @click="completeOnboarding"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth-store'
import { useBubbleStore } from 'stores/bubble-store'
import BubbleCard from 'components/BubbleCard.vue'
import { notifySuccess, notifyError } from 'src/utils/notify'

const auth = useAuthStore()
const bubbleStore = useBubbleStore()
const router = useRouter()

const selectedTags = ref([])
const selectedBubbles = ref([])

const allTags = [
  'philosophy',
  'politics',
  'climate',
  'science',
  'tech',
  'startups',
  'coding',
  'ai',
  'art',
  'design',
  'aesthetics',
  'writing',
  'poetry',
  'literature',
  'education',
  'learning',
  'wellness',
  'mindfulness',
  'psychology',
  'culture',
  'trending',
  'now',
  'queer',
  'gender',
  'identity',
  'sports',
  'analysis',
  'fanbase',
  'fringe',
  'dreams',
  'unexplained',
  'news',
  'trending',
  'culture',
  'media',
  'movies',
  'tv',
  'film',
  'anime',
  'manga',
  'books',
  'reading',
  'literature',
  'fandom',
  'criticism',
  'discourse',
  'soundtrack',
  'series',
  'reviews',
]

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
}

function toggleBubble(id) {
  const idx = selectedBubbles.value.indexOf(id)
  if (idx >= 0) selectedBubbles.value.splice(idx, 1)
  else selectedBubbles.value.push(id)
}

const filteredBubbles = computed(() =>
  bubbleStore.all.filter(
    (b) =>
      selectedTags.value.length === 0 || selectedTags.value.some((tag) => b.tags?.includes(tag)),
  ),
)

async function completeOnboarding() {
  try {
    for (const bubbleId of selectedBubbles.value) {
      await bubbleStore.join(auth.user.id, bubbleId)
    }

    await supabase
      .from('user_profiles')
      .update({
        onboarding_complete: true,
        interest_tags: selectedTags.value,
      })
      .eq('user_id', auth.user.id)

    notifySuccess('Welcome to the bubble 🎉')
    router.push('/explore')
  } catch (err) {
    notifyError(err)
  }
}

onMounted(async () => {
  await bubbleStore.fetchAll()
})
</script>
