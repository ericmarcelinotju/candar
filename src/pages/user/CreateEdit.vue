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
import { get as getDivisions } from '@/api/division'
import { required, alpha, phone, email } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { User } from '@/typings/models/user.type'
import { Role } from '@/typings/models/role.type'
import { userList } from '@/router/routes/user'
import { Option } from '@/typings/option.type'
import { Division } from '@/typings/models/division.type'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
const roleOptions: Ref<Option[]> = computed(() =>
  roles.value.map((role) => ({ label: role.name, value: role.id }))
)

const divisions: Ref<Division[]> = ref([])
const divisionOptions: Ref<Option[]> = computed(() =>
  divisions.value.map((division) => ({
    label: division.name,
    value: division.id
  }))
)

const initPage = () => {
  if (!id) return
  loading.value = true
  getUser(id)
    .then((res) => {
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
      .catch(err => {
        notify('updated', 'danger', err.message)
      })
      .finally(onFinish)
  } else {
    return insertUser({ ...form.value })
      .then(() => {
        router.push(userList)
        notify('inserted')
      })
      .catch(err => {
        notify('inserted', 'danger', err.message)
      })
      .finally(onFinish)
  }
}

onMounted(() => {
  initPage()

  Promise.all([getRoles(), getDivisions()]).then((res) => {
    roles.value = res[0].data.data
    divisions.value = res[1].data.data
    initForm()
  })
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'username',
      label: t('app.columns.username'),
      isRequired: true,
      autocomplete: 'user-username',
      rules: [required, alpha]
    },
    {
      key: 'email',
      label: t('app.columns.email'),
      isRequired: true,
      rules: [required, email],
      type: 'textarea'
    },
    {
      key: 'phone',
      label: t('app.columns.phone'),
      isRequired: true,
      rules: [required, phone]
    },
    {
      key: 'password',
      label: t('app.columns.password'),
      type: 'password'
    },
    {
      key: 'confirmPassword',
      label: t('app.columns.confirm_password'),
      type: 'password'
    },
    {
      key: 'roleId',
      label: t('app.columns.role'),
      isRequired: true,
      type: 'dropdown',
      options: roleOptions.value
    },
    {
      key: 'divisionId',
      label: t('app.columns.division'),
      type: 'dropdown',
      options: divisionOptions.value
    }
  ]
}
initForm()
</script>
