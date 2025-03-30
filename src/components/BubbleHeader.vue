<template>
  <div class="bubble-header">
    <q-img
      v-if="coverImage"
      :src="coverImage"
      class="bubble-cover"
      :ratio="16 / 9"
      spinner-color="accent"
    >
      <div class="absolute-full bg-overlay" />
      <div class="absolute-bottom text-white q-pa-md">
        <div class="text-h4 text-bold">{{ name }}</div>
        <div class="row q-gutter-xs q-mt-sm">
          <q-chip
            v-for="tag in tags"
            :key="tag"
            color="primary"
            text-color="white"
            dense
            size="sm"
            :label="`🌐 ${tag}`"
          />
          <q-chip
            v-if="levelTag"
            color="accent"
            text-color="white"
            dense
            size="sm"
            :label="`Level: ${levelTag}`"
          />
        </div>
      </div>
    </q-img>

    <!-- Fallback if no image -->
    <div v-else class="bubble-header-alt q-pa-md">
      <div class="text-h4 text-white">{{ name }}</div>
      <div class="row q-gutter-xs q-mt-sm">
        <q-chip
          v-for="tag in tags"
          :key="tag"
          color="primary"
          text-color="white"
          dense
          size="sm"
          :label="`🌐 ${tag}`"
        />
        <q-chip
          v-if="levelTag"
          color="accent"
          text-color="white"
          dense
          size="sm"
          :label="`Level: ${levelTag}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  tags: Array,
  levelTag: String,
  coverImage: String,
})
</script>

<style scoped>
.bubble-header {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.bubble-cover {
  object-fit: cover;
  max-height: 300px;
  border-radius: 12px;
}

.bg-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.bubble-header-alt {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}
</style>
