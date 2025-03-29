<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form @submit.prevent="login" class="login-form q-gutter-md">
      <div class="text-h4 text-white text-center">Welcome Back</div>
      <div class="text-subtitle2 text-grey-4 text-center q-mb-md">Enter the bubble of ideas</div>

      <q-input
        filled
        v-model="email"
        label="Email"
        type="email"
        dense
        autofocus
        :disable="loading"
      />

      <q-input
        filled
        v-model="password"
        label="Password"
        type="password"
        dense
        :disable="loading"
      />

      <div class="row items-center justify-between">
        <q-btn
          flat
          size="sm"
          label="Forgot Password?"
          class="text-primary"
          @click="forgotPassword"
        />
      </div>

      <q-btn
        label="Log In"
        color="primary"
        unelevated
        class="full-width"
        type="submit"
        :loading="loading"
      />

      <q-banner v-if="error" class="bg-negative text-white" rounded dense>
        {{ error }}
      </q-banner>

      <q-separator spaced />

      <!-- Google OAuth Button -->
      <q-btn
        outline
        color="white"
        icon="fab fa-google"
        label="Log in with Google"
        class="full-width"
        @click="loginWithGoogle"
        :disable="loading"
      />

      <div class="text-caption text-center text-grey q-mt-sm">
        Don’t have an account?
        <q-btn flat label="Sign Up" class="text-primary" @click="goToSignup" />
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
const loading = ref(false)
const error = ref(null)

async function login() {
  loading.value = true
  error.value = null

  try {
    await auth.login(email.value, password.value)
    await auth.fetchUser()
    router.push('/explore')
  } catch (err) {
    error.value = err.message || 'Login failed'
    $q.notify({ type: 'negative', message: error.value })
  } finally {
    loading.value = false
  }
}

function forgotPassword() {
  router.push('/forgot-password')
}

function goToSignup() {
  router.push('/register')
}

async function loginWithGoogle() {
  $q.notify({ message: 'Google login coming soon!', color: 'secondary' })
  // Supabase OAuth can be wired here later:
  // await supabase.auth.signInWithOAuth({ provider: 'google' })
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
