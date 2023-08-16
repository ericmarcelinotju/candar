<template>
  <DefaultPage :title="$t('app.columns.user')">
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
    />
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getUser,
  insert as insertUser,
  update as updateUser
} from '@/api/user'
import { get as getRoles } from '@/api/role'
import { required, alpha } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { User } from '@/typings/models/user.type'
import { Role } from '@/typings/models/role.type'
import { userList } from '@/router/routes/user'
import { Option } from '@/typings/option.type'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('user')

const initialData: Ref<User> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const roles: Ref<Role[]> = ref([])
const roleOptions: Ref<Option[]> = computed(() => roles.value.map(role => ({ label: role.name, value: role.id })))

const initPage = () => {
  if (!id) return
  loading.value = true
  getUser(id)
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
    return updateUser(id, { ...form.value })
      .then(() => {
        router.push(userList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertUser({ ...form.value })
      .then(() => {
        router.push(userList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}

onMounted(() => {
  initPage()
  if (hasPermission('GET', 'ROLE')) {
    getRoles()
      .then(res => {
        roles.value = res.data.roles
        initForm()
      })
  }
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'username',
      label: 'Username',
      isRequired: true,
      autocomplete: 'user-username',
      rules: [required, alpha]
    },
    {
      key: 'email',
      label: 'Email',
      isRequired: true,
      type: 'textarea'
    },
    {
      key: 'password',
      label: 'Password',
      isRequired: true,
      type: 'password'
    },
    {
      key: 'confirm_password',
      label: 'Confirm Password',
      isRequired: true,
      type: 'password'
    },
    {
      key: 'role_id',
      label: 'Role',
      isRequired: true,
      type: 'dropdown',
      options: roleOptions.value
    }
  ]
}
initForm()
</script>
