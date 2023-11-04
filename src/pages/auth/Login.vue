<template>
  <div class="absolute h-full w-full flex">
    <div
      class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img
            alt="Workflow"
            class="h-32 w-auto"
            src="@/assets/logo.svg"
          >
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <!-- <p class="mt-2 text-sm text-gray-600">
            Or
            {{ " " }}
            <a
              class="font-medium text-green-600 hover:text-green-500"
              href="#"
            >
              contact us for account creation
            </a>
          </p> -->
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form
              action="#"
              class="space-y-6"
              method="POST"
              @submit.prevent="handleLogin"
            >
              <div>
                <label
                  class="default-label"
                  for="username"
                > Username </label>
                <div class="mt-1">
                  <input
                    id="username"
                    v-model="params.username"
                    autocomplete="login-username"
                    class="default-input"
                    name="username"
                    required
                    type="text"
                  >
                </div>
              </div>

              <div class="space-y-1">
                <label
                  class="default-label"
                  for="password"
                > Password </label>
                <div class="mt-1">
                  <input
                    id="password"
                    v-model="params.password"
                    class="default-input"
                    name="password"
                    required
                    type="password"
                  >
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    v-model="params.remember_me"
                    class="default-checkbox"
                    name="remember-me"
                    type="checkbox"
                  >
                  <label
                    class="ml-2 block text-sm text-gray-900"
                    for="remember-me"
                  >
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <a
                    class="font-semibold text-primary hover:text-primary-dark cursor-pointer"
                    @click="handleForgotPassword"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  class="w-full info-button"
                  type="submit"
                >
                  Sign in
                </button>
              </div>

              <div
                v-if="error"
                class="font-bold text-sm text-[#ff0000] mb-4"
              >
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        src="@/assets/img/login-background.jpg"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { forgotPassword } from '@/api/auth'
import { required, email } from '@/utils/validation'
import { dashboardRoute } from '@/router/routes'

const router = useRouter()
const store = useStore()

const user = {
  username: '',
  password: '',
  remember_me: false
}

const params = reactive({ ...user })
const error = ref(null)

const handleLogin = () => {
  store.dispatch('auth/login', { ...params })
    .then(() => {
      router.push(dashboardRoute)
    })
    .catch((err) => {
      console.log(err)
      if (err.response.data.includes('NotAuthorized')) {
        error.value = 'Invalid Username or Password'
      } else {
        error.value = 'Unexpected Error'
      }
    })
}

const defaultForgotPasswordParams = {
  username: null,
  email: null
}
const forgotPasswordParams = reactive({ ...defaultForgotPasswordParams })
const forgotPasswordLoading = ref(false)
const forgotPasswordMessage = ref('')
const visibleForgotPasswordModal = ref(false)
const handleForgotPassword = () => {
  visibleForgotPasswordModal.value = true
}
const onConfirmForgotPassword = () => {
  forgotPasswordLoading.value = true

  // Validate form
  const usernameReq = !required(forgotPasswordParams.username)
  const emailReq = !required(forgotPasswordParams.email)

  if (usernameReq && emailReq) {
    forgotPasswordMessage.value = 'Both username and email field are required.'
  }
  const emailEmail = !email(forgotPasswordParams.email)
  if (!emailReq && emailEmail) {
    forgotPasswordMessage.value = 'Email format invalid.'
  }
  if (usernameReq || emailReq || emailEmail) {
    forgotPasswordLoading.value = false
    return
  }

  forgotPassword(forgotPasswordParams)
    .then(() => {
      forgotPasswordMessage.value =
        'Reset password email has been sent! Please check your e-mail.'

      setTimeout(() => {
        visibleForgotPasswordModal.value = false
      }, 5000)
    })
    .catch((err) => {
      if (err.response.status === 404) {
        forgotPasswordMessage.value =
          'Incorrect username or email. Contact your administrator.'
      } else {
        forgotPasswordMessage.value =
          'Unexpected error, please contact your administrator.'
      }
    })
    .finally(() => {
      forgotPasswordLoading.value = false
    })
}

const onCloseForgotPassword = () => {
  forgotPasswordLoading.value = false
  forgotPasswordMessage.value = ''
  Object.assign(forgotPasswordParams, defaultForgotPasswordParams)
}
</script>
