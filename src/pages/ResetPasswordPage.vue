<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form @submit.prevent="resetPassword" class="reset-form q-gutter-md">
      <div class="text-h5 text-white text-center">Choose a New Password</div>
      <div class="text-subtitle2 text-grey-4 text-center q-mb-md">
        Your reset link is valid — finish updating your password.
      </div>

      <q-input
        dark
        filled
        v-model="password"
        label="New Password"
        type="password"
        dense
        autofocus
        :disable="loading"
      />

      <q-input
        dark
        filled
        v-model="confirmPassword"
        label="Confirm New Password"
        type="password"
        dense
        :disable="loading"
      />

      <q-btn
        label="Reset Password"
        color="primary"
        unelevated
        class="full-width"
        type="submit"
        :loading="loading"
      />

      <q-banner v-if="message" class="bg-positive text-white" dense rounded>
        {{ message }}
      </q-banner>

      <q-banner v-if="error" class="bg-negative text-white" dense rounded>
        {{ error }}
      </q-banner>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const message = ref(null)

onMounted(async () => {
  // Supabase automatically picks up token from URL
  const { data, error } = await supabase.auth.getSession()
  if (!data?.session && error) {
    $q.notify({ type: 'negative', message: 'Invalid or expired link.' })
    router.replace('/login')
  }
})

async function resetPassword() {
  loading.value = true
  error.value = null
  message.value = null

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    loading.value = false
    return
  }

  const { error: err } = await supabase.auth.updateUser({
    password: password.value,
  })

  if (err) {
    error.value = err.message || 'Failed to reset password.'
    $q.notify({ type: 'negative', message: error.value })
  } else {
    message.value = 'Password updated! Redirecting to login...'
    $q.notify({ type: 'positive', message: message.value })

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  loading.value = false
}
</script>

<style scoped>
.reset-form {
  width: 100%;
  max-width: 400px;
}
</style>
