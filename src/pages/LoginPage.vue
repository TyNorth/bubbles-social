<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form @submit.prevent="login" class="login-form q-gutter-md">
      <div class="text-h4 text-white text-center">Welcome Back</div>
      <div class="text-subtitle2 text-grey-4 text-center q-mb-md">Enter the bubble of ideas</div>

      <q-input
        filled
        dark
        v-model="email"
        label="Email"
        type="email"
        :rules="email.length != 0 ? [rules.required, rules.email] : []"
        dense
        label-color="grey-4"
        autofocus
        class="full-width"
        :disable="loading"
      />

      <q-input
        filled
        dark
        v-model="password"
        label="Password"
        type="password"
        :rules="password.length != 0 ? [rules.required] : []"
        dense
        label-color="grey-4"
        class="full-width"
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

      <!-- Google OAuth Button
      <q-btn
        outline
        color="white"
        icon="bi-google"
        label="Log in with Google"
        class="full-width"
        @click="loginWithGoogle"
        :disable="loading"
      />
       -->

      <div class="text-caption text-center text-grey q-mt-sm">
        Don't have an account?
        <q-btn flat label="Sign Up" class="text-primary" @click="goToSignup" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { notifyError } from 'src/utils/notify'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const rules = {
  required: (val) => !!val || 'This field is required',
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
}

async function login() {
  if (!email.value || !password.value) {
    notifyError('Please fill in both email and password.')
    return
  }

  loading.value = true

  try {
    await auth.login(email.value, password.value)
    await auth.fetchUser()
    console.log(auth.user)
    if (auth.user) {
      router.push('/explore')
    } else {
      notifyError('Login failed. Please try again.')
    }
  } catch (err) {
    notifyError(err.message || 'Login failed. Please check your credentials.')
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
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
