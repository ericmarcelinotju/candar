<template>
  <div class="absolute h-full w-full flex flex-col justify-center text-white">
    <img
      alt="login background"
      class="absolute h-full w-full"
      src="@/assets/img/login-background.jpg"
    >
    <div class="mx-auto w-full max-w-sm lg:w-96 z-10">
      <h2 class="mt-6 text-3xl text-center">
        Reset Password
      </h2>

      <div class="mt-8">
        <form
          action="#"
          method="POST"
          @submit.prevent="handleResetPassword"
        >
          <div
            v-if="errorMessage"
            class="font-bold text-sm text-[#ff0000] mb-4"
          >
            {{ errorMessage }}
          </div>
          <div class="relative">
            <UserIcon class="absolute left-0 w-6 h-6" />
            <input
              id="new_password"
              v-model="params.new_password"
              name="new_password"
              placeholder="New Password"
              required
              type="password"
            >
          </div>

          <div class="mt-4 relative">
            <LockClosedIcon class="absolute left-0 w-6 h-6" />
            <input
              id="confirm_password"
              v-model="params.confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              required
              type="password"
            >
          </div>

          <div class="mt-6 flex items-center justify-between">
            <div />
            <div class="text-sm">
              <a
                class="font-medium cursor-pointer"
                @click="handleLogin"
              >
                &lt; back to login
              </a>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button
              class="info-button submit"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserIcon, LockClosedIcon } from '@heroicons/vue/solid'
import { resetPassword } from '@/api/auth'
import { login } from '@/router/routes/auth'

const route = useRoute()
const router = useRouter()

const defaultParams = {
  new_password: null,
  confirm_password: null
}

const params = reactive({ ...defaultParams })
const errorMessage = ref('')

const handleResetPassword = () => {
  if (params.new_password !== params.confirm_password) {
    errorMessage.value = 'Confirm password did not match!'
    return
  }

  resetPassword({
    ...params,
    forgot_token: route.query.fpkey
  })
    .then(() => {
      handleLogin()
    })
    .catch(err => {
      errorMessage.value = err
    })
}

const handleLogin = () => {
  router.replace(login)
}
</script>

<style lang="scss" scoped>
input#new_password,
input#confirm_password {
  @apply mt-1 pl-8 block w-full shadow-sm text-sm border-0 border-b border-white bg-transparent ring-0 outline-0;

  &::placeholder {
    @apply text-gray-400;
  }
}

button.submit {
  @apply text-xl py-2 px-12;
}
</style>
