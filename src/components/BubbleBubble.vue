<template>
  <div
    class="bubble-bubble"
    :class="{ joined }"
    @click="$emit('click')"
    @mouseenter="$emit('hover')"
  >
    <div class="bubble-label">
      {{ name }}
    </div>

    <div class="bubble-tags" v-if="tags?.length">
      <q-chip
        v-for="tag in tags.slice(0, 2)"
        :key="tag"
        dense
        size="xs"
        color="accent"
        text-color="white"
        class="q-mx-xs"
      >
        {{ tag }}
      </q-chip>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  tags: Array,
  joined: Boolean,
})
</script>

<style scoped>
.bubble-bubble {
  border-radius: 50%;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle at center, #1e1e2f, #12121a);
  border: 2px solid #4dabf7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(77, 171, 247, 0.2);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
}

.bubble-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 0 24px rgba(138, 255, 255, 0.5);
}

.bubble-label {
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  padding: 0 10px;
  line-height: 1.2;
}

.bubble-tags {
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
