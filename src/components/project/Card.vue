<template>
  <div
    class="project-item"
    @click="onClick"
  >
    <div
      v-if="hasTag"
      class="flex gap-1 mb-2"
    >
      <div
        v-if="isExpired"
        class="danger-tag"
      >
        {{ $t('project.expired') }}
      </div>
      <div
        v-else-if="isAlmostExpired"
        class="warning-tag"
      >
        {{ $t('project.attention') }}
      </div>
      <div
        v-if="isNeedQuotation"
        class="info-tag"
      >
        {{ $t('project.need_quotation') }}
      </div>
      <div
        v-if="isQuoted"
        class="success-tag"
      >
        {{ $t('project.quoted') }}
      </div>
    </div>
    <div>{{ data.name }}</div>
    <div class="flex justify-end mt-2">
      <UserAvatar :user="data.user" />
    </div>
    <div class="task-status">
      {{ taskProgress }}
    </div>
    <PencilIcon class="edit-icon" />
  </div>
</template>

<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/solid'
import { Project } from '@/typings/models/project.type'
import { useProject } from '@/composables/use-project'
import UserAvatar from '@/components/UserAvatar.vue'

interface Props {
  index: number
  data: Project
}

const props = defineProps<Props>()
const emit = defineEmits(['click'])

const onClick = () => {
  emit('click', props.data)
}

const {
  isAlmostExpired,
  isExpired,
  isNeedQuotation,
  isQuoted,
  taskProgress,
  hasTag
} = useProject(props.data)
</script>
