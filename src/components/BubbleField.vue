<template>
  <div class="bubble-field">
    <transition-group name="bubble-float" tag="div">
      <div
        v-for="(bubble, index) in bubbles"
        :key="bubble.id"
        class="bubble-wrapper"
        :style="positions[bubble.id]"
        @click="$emit('click', bubble)"
      >
        <BubbleBubble
          :name="bubble.name"
          :tags="bubble.tags"
          :joined="joinedBubbles.includes(bubble.id)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import BubbleBubble from './BubbleBubble.vue'
import { watch, ref } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  bubbles: Array,
  joinedBubbles: Array,
  filterTags: Array,
})

function bubbleStyle(index) {
  const angle = index * 137.5 // golden angle
  const radius = 120 + index * 20 // spacing out
  const x = 50 + Math.cos(angle * (Math.PI / 180)) * radius
  const y = 50 + Math.sin(angle * (Math.PI / 180)) * radius
  const scale = 0.9 + Math.sin(index) * 0.1

  return {
    top: `${Math.min(Math.max(y, 5), 90)}%`,
    left: `${Math.min(Math.max(x, 5), 90)}%`,
    transform: `scale(${scale})`,
  }
}

const positions = ref({})

function runD3Simulation(bubbles) {
  const radius = 90
  const width = window.innerWidth
  const height = window.innerHeight

  const nodes = bubbles.map((b) => ({ id: b.id }))
  const sim = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'collision',
      d3
        .forceCollide()
        .radius(() => 90)
        .strength(0.9),
    )

    .stop()

  for (let i = 0; i < 300; ++i) {
    sim.tick()
  }

  const result = {}
  nodes.forEach((n) => {
    result[n.id] = {
      top: `${Math.min(Math.max((n.y / height) * 100, 5), 78)}%`,

      left: `${Math.min(Math.max((n.x / width) * 100, 5), 85)}%`,
    }
  })
  positions.value = result
}

watch(
  () => props.bubbles,
  (b) => {
    if (b?.length) runD3Simulation(b)
  },
  { immediate: true },
)
</script>

<style scoped>
.bubble-field {
  position: relative;
  height: calc(140vh - 4rem); /* or try 110vh for a soft overflow */
  overflow: hidden;

  padding-bottom: 10rem;

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.bubble-field::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.bubble-wrapper {
  position: absolute;
  transition: transform 1.2s ease-in-out;
  animation: drift 6s infinite ease-in-out alternate;
}

.bubble-wrapper:hover {
  transform: scale(1.1) translateY(-6px);
  z-index: 10;
  filter: drop-shadow(0 0 12px rgba(138, 255, 255, 0.3));
}

@keyframes drift {
  0% {
    transform: translateY(0px);
    opacity: 0.9;
  }
  100% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
</style>
