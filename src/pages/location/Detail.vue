<template>
  <CustomDetail
    :data="data"
    :excluded-fields="[]"
    :loading="loading"
  >
    <div class="min-w-full">
      <div class="text-gray-900 border-b-2 border-green-500 pb-5">
        <h3 class="text-lg font-medium ml-5">
          User Details
        </h3>
      </div>
      <div class="grid grid-cols-12 gap-6 mt-4">
        <div class="col-span-12 sm:col-span-6">
          <label
            class="default-label pb-1 pl-2"
            for="username"
          >
            {{ $t('app.columns.username') }}
          </label>
          <h1 class="default-detail">
            {{ data.username }}
          </h1>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label
            class="default-label pb-1 pl-2"
            for="email"
          >
            {{ $t('app.columns.email') }}
          </label>
          <h1 class="default-detail">
            {{ data.email }}
          </h1>
        </div>
      </div>
      <div class="col-span-6 mt-6">
        <label
          class="default-label pb-1 pl-2"
          for="role_name"
        >
          {{ $t('app.columns.role') }}
        </label>
        <h1 class="default-detail">
          <a
            v-if="hasPermission('GET', 'ROLE')"
            class="inline-flex items-center text-sky-700 hover:text-sky-900 cursor-pointer mr-5"
            @click="handleViewRole(data.role_id)"
          >
            {{ data.role_name }}
          </a>
          <span v-else>{{ data.role_name }}</span>
        </h1>
      </div>
    </div>
  </CustomDetail>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { roleDetail } from '@/router/routes/role'

const router = useRouter()
const store = useStore()

const handleViewRole = (id) => {
  router.push({ ...roleDetail, params: { id } })
}

const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
