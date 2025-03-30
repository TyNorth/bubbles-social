<template>
  <q-card class="bubble-card" :flat="!elevated" :bordered="bordered" @click="handleClick">
    <div class="bubble-cover" v-if="coverImage">
      <q-img :src="coverImage" :ratio="16 / 9" class="bubble-img" />
    </div>

    <q-card-section class="q-pt-sm">
      <div class="text-h6 text-white">{{ name }}</div>
      <div class="text-caption text-grey-4 ellipsis">{{ description }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-chip
        v-for="tag in tags"
        :key="tag"
        :label="`🌐 ${tag}`"
        size="sm"
        class="q-mr-xs q-mb-xs"
        color="primary"
        text-color="white"
        dense
        clickable
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-if="!joined" label="Peek" flat color="accent" size="sm" @click.stop="peek" />
      <q-btn v-else label="Enter" unelevated color="primary" size="sm" @click.stop="enter" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineProps({
  name: String,
  description: String,
  tags: Array,
  coverImage: String,
  joined: Boolean,
  elevated: {
    type: Boolean,
    default: true,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['peek', 'enter', 'click'])

function handleClick() {
  emit('click')
}

function peek() {
  emit('peek')
}

function enter() {
  emit('enter')
}
</script>

<style scoped>
.bubble-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.bubble-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.bubble-cover {
  overflow: hidden;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}

.bubble-img {
  object-fit: cover;
}
</style>
