<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form @submit.prevent="register" class="register-form q-gutter-md">
      <div class="text-h4 text-white text-center">Create Account</div>
      <div class="text-subtitle2 text-grey-4 text-center q-mb-md">
        Start your journey beyond the bubble
      </div>

      <q-input
        filled
        v-model="email"
        label="Email"
        type="email"
        dense
        autofocus
        class="full-width"
        :disable="loading"
      />

      <q-input
        filled
        v-model="password"
        label="Password"
        type="password"
        class="full-width"
        dense
        :disable="loading"
      />

      <q-input
        filled
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        dense
        :disable="loading"
        class="full-width"
      />

      <q-btn
        label="Sign Up"
        color="primary"
        unelevated
        class="full-width"
        type="submit"
        :loading="loading"
      />

      <q-banner v-if="error" class="bg-negative text-white" dense rounded>
        {{ error }}
      </q-banner>

      <q-separator spaced />

      <div class="text-caption text-center text-grey q-mt-sm">
        Already have an account?
        <q-btn flat label="Log In" class="text-primary" @click="goToLogin" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)

async function register() {
  loading.value = true
  error.value = null

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await auth.register(email.value, password.value)
    await auth.fetchUser()
    router.push('/setup') // go straight into onboarding
  } catch (err) {
    error.value = err.message || 'Registration failed'
    $q.notify({ type: 'negative', message: error.value })
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-form {
  width: 100%;
  max-width: 400px;
}
</style>
