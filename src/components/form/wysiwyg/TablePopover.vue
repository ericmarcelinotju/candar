<template>
  <div
    v-for="i in 5"
    :key="i"
    class="flex mb-1"
  >
    <button
      v-for="j in 5"
      :key="j"
      class="control-button mr-1"
      :class="{ 'is-active': isInsertTableCellActive(i, j) }"
      :title="title"
      @click="action(i, j)"
      @mouseenter="onInsertTableCellHover(i, j)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  action: {
    type: Function,
    required: true
  }
})

const hoveredInsertTableCell = ref([0, 0])

const onInsertTableCellHover = (i, j) => {
  hoveredInsertTableCell.value = [i, j]
}

const isInsertTableCellActive = (i, j) => {
  if (i > hoveredInsertTableCell.value[0] || j > hoveredInsertTableCell.value[1]) {
    return false
  }
  return true
}
</script>
