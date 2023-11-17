<template>
  <InfoButton :info="user.username">
    <div v-if="avatar">
      <img :src="avatar">
    </div>
    <div
      v-else
      class="info-tag !rounded-full capitalize w-6 h-6"
    >
      {{ userInitial }}
    </div>
  </InfoButton>
</template>

<script setup lang="ts">
import { User } from '@/typings/models/user.type'
import { computed } from 'vue'
import InfoButton from '@/components/helper/InfoButton.vue'

interface Props {
  user: User
}

const props = defineProps<Props>()

const avatar = computed(() => {
  return props.user?.avatar
})

const userInitial = computed(() => {
  return props.user?.username[0]
})
</script>
