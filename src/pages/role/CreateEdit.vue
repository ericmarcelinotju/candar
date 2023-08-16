<template>
  <DefaultPage :title="$t('app.columns.role')">
    <div
      v-if="loading"
      class="w-full h-full flex justify-center items-center"
    >
      <Loading class="h-12 w-12" />
    </div>
    <DefaultCreateEdit
      v-else
      :form-settings="formSettings"
      :initial-data="initialData"
      @submit="onSubmit"
    >
      <template #permissions="{ form }">
        <div class="grid grid-cols-5 gap-4 mt-6">
          <div />
          <div
            v-for="method in ['GET', 'POST', 'PUT', 'DELETE']"
            :key="method"
            class="text-center mr-4"
          >
            {{ method }}
          </div>
        </div>
        <div
          v-for="(module, index) in mappedPermissions"
          :key="index"
          class="grid grid-cols-5 gap-4 mt-2 pb-1 border-b border-gray-300"
        >
          <h5>
            {{ module.name }}
          </h5>
          <div
            v-for="method in ['GET', 'POST', 'PUT', 'DELETE']"
            :key="method"
            class="default-label text-center"
          >
            <input
              v-if="module.permissions[method]"
              v-model="form.permissions"
              class="default-checkbox"
              type="checkbox"
              :value="module.permissions[method]"
            >
          </div>
        </div>
      </template>
    </DefaultCreateEdit>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loading from '@/components/helper/Loading.vue'
import DefaultPage from '@/components/default/Page.vue'
import {
  detail as getRole,
  insert as insertRole,
  update as updateRole
} from '@/api/role'
import {
  get as getPermissions
} from '@/api/permission'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import { useNotify } from '@/composables/use-notify'
import { Role } from '@/typings/models/role.type'
import { roleList } from '@/router/routes/role'
import { FormSetting } from '@/typings/form.type'
import { alpha, required } from '@/utils/validation'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('user')

const initialData: Ref<Role> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const permissions = ref([])

const mappedPermissions = computed(() => {
  const mappedPermissions = {}
  permissions.value.forEach(permission => {
    if (!mappedPermissions[permission.module]) mappedPermissions[permission.module] = {}
    mappedPermissions[permission.module][permission.method] = permission
  })
  const arrayPermissions = []
  Object.keys(mappedPermissions).forEach(module => {
    arrayPermissions.push({
      name: module,
      permissions: mappedPermissions[module]
    })
  })
  return arrayPermissions
})

const initPage = () => {
  if (!id) return
  loading.value = true
  getRole(id)
    .then(res => {
      initialData.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  if (id) {
    return updateRole(id, { ...form.value })
      .then(() => {
        router.push(roleList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertRole({ ...form.value })
      .then(() => {
        router.push(roleList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

onMounted(() => {
  initPage()
  getPermissions()
    .then(res => {
      permissions.value = res.data.permissions
    })
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required, alpha]
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea'
    },
    {
      key: 'permissions',
      label: 'Permissions',
      isRequired: true,
      default: []
    }
  ]
}
initForm()
</script>
