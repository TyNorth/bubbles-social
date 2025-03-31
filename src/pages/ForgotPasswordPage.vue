<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form @submit.prevent="sendResetEmail" class="forgot-form q-gutter-md">
      <div class="text-h5 text-white text-center">Reset Your Password</div>
      <div class="text-subtitle2 text-grey-4 text-center q-mb-md">
        We’ll send you an email with a reset link.
      </div>

      <q-input
        dark
        filled
        v-model="email"
        label="Email"
        type="email"
        dense
        autofocus
        :disable="loading"
      />

      <q-btn
        label="Send Reset Email"
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

      <q-separator spaced />

      <div class="text-caption text-center text-grey q-mt-sm">
        <q-btn flat label="Back to Login" class="text-primary" @click="goToLogin" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const error = ref(null)
const message = ref(null)

async function sendResetEmail() {
  loading.value = true
  error.value = null
  message.value = null

  const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (err) {
    error.value = err.message || 'Something went wrong'
    $q.notify({ type: 'negative', message: error.value })
  } else {
    message.value = 'Check your inbox for the reset link!'
    $q.notify({ type: 'positive', message: message.value })
  }

  loading.value = false
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.forgot-form {
  width: 100%;
  max-width: 400px;
}
</style>
