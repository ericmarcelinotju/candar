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
        v-if="isAlmostExpired"
        class="danger-tag"
      >
        Antention Needed
      </div>
      <div
        v-if="isNeedQuotation"
        class="warning-tag"
      >
        Quotation Needed
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
    <PencilIcon class="edit-icon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  isNeedQuotation,
  hasTag
} = useProject(props.data)
</script>
