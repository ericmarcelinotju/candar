<template>
  <div class="project-item" @click="onClick">
    <div v-if="hasTag" class="flex gap-1 mb-2">
      <div v-if="isAlmostExpired" class="danger-tag">Antention Needed</div>
      <div v-if="isNeedQuotation" class="warning-tag">Quotation Needed</div>
    </div>
    <div>{{ data.name }} {{ index }}</div>
    <div class="flex justify-end mt-2">
      <div v-if="avatar">
        <img :src="avatar" />
      </div>
      <div v-else class="info-tag !rounded-full capitalize">
        {{ userInitial }}
      </div>
    </div>
    <PencilIcon class="edit-icon" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { projectEdit } from '@/router/routes/project'
import { Project } from '@/typings/models/project.type'
import { computed } from 'vue'
import dayjs from 'dayjs'

interface Props {
  index: number
  data: Project
}

const props = defineProps<Props>()
const router = useRouter()

const onClick = () => {
  router.push({ ...projectEdit, params: { id: props.data.id } })
}

const avatar = computed(() => {
  return props.data.user?.avatar
})

const userInitial = computed(() => {
  return props.data.user?.username[0]
})

const isNeedQuotation = computed(() => {
  // TODO :: validate quotation must exist
  return props.data.status === 'quotation'
})

const isAlmostExpired = computed(() => {
  // TODO :: validate project expiry
  return dayjs().diff(dayjs(props.data.created_at), 'day') > 15
})

const hasTag = computed(() => isNeedQuotation.value || isAlmostExpired.value)
</script>
