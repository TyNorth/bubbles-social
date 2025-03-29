<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <!-- Animated / Bubbly background -->
    <div class="bubble-bg">
      <div class="bubble" v-for="n in 10" :key="n" />
    </div>

    <q-page-container>
      <q-page class="flex flex-center q-pa-md">
        <div class="auth-wrapper">
          <div class="auth-panel">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// no logic needed here yet
</script>

<style scoped>
.auth-layout {
  background: radial-gradient(ellipse at top, #1e1f26 0%, #0f0f15 100%);
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  color: white;
}

/* Bubbles floating in background */
.bubble-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bubble {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  animation: float 12s infinite ease-in-out;
  backdrop-filter: blur(3px);
}

.bubble:nth-child(odd) {
  background: rgba(255, 255, 255, 0.06);
  width: 120px;
  height: 120px;
}

.bubble:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}
.bubble:nth-child(2) {
  top: 50%;
  left: 20%;
  animation-delay: 2s;
}
.bubble:nth-child(3) {
  top: 70%;
  left: 80%;
  animation-delay: 4s;
}
.bubble:nth-child(4) {
  top: 30%;
  left: 70%;
  animation-delay: 1s;
}
.bubble:nth-child(5) {
  top: 10%;
  left: 50%;
  animation-delay: 3s;
}
/* Add more styles or randomness as needed */

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-40px) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
}

.auth-wrapper {
  z-index: 2;
  max-width: 500px;
  width: 100%;
  padding: 2rem;
}

.auth-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  padding: 2rem;
}
</style>
