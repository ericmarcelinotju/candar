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
        Expired
      </div>
      <div
        v-else-if="isAlmostExpired"
        class="warning-tag"
      >
        Attention
      </div>
      <div
        v-if="isNeedQuotation"
        class="info-tag"
      >
        Quotation Needed
      </div>
      <div
        v-if="isQuoted"
        class="success-tag"
      >
        Quoted
      </div>
    </div>
    <div>{{ data.name }}</div>
    <div class="flex justify-end mt-2">
      <div v-if="avatar">
        <img :src="avatar">
      </div>
      <div
        v-else
        class="info-tag !rounded-full capitalize"
      >
        {{ userInitial }}
      </div>
    </div>
    <div class="task-status">
      {{ taskProgress }}
    </div>
    <PencilIcon class="edit-icon" />
  </div>
</template>

<script setup lang="ts">
import { Project } from '@/typings/models/project.type'
import { useProject } from '@/composables/use-project'
import { PencilIcon } from '@heroicons/vue/solid'

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
  avatar,
  userInitial,
  isAlmostExpired,
  isExpired,
  isNeedQuotation,
  isQuoted,
  taskProgress,
  hasTag
} = useProject(props.data)
</script>
