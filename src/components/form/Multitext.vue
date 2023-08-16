<template>
  <div class="custom-multiselect">
    <multiselect
      v-model="value"
      :multiple="true"
      :options="[]"
      :taggable="true"
      @tag="addTag"
    />
    <span class="default-input-message">{{ errMsg || error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import Multiselect from 'vue-multiselect'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  errMsg: {
    type: String,
    default: ''
  },
  validation: {
    type: Function,
    default: () => ''
  },
  duplicateErrMsg: {
    type: String,
    default: 'app.components.multitext.duplicateErr'
  }
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const error = ref('')

const addTag = async (newTag) => {
  error.value = ''

  if (!value.value) {
    value.value = []
    await nextTick()
  }

  const isDuplicate = !!value.value.find(item => item === newTag)
  if (isDuplicate) {
    error.value = props.duplicateErrMsg
    return
  }

  const validateMsg = props.validation(newTag)
  if (validateMsg) {
    error.value = validateMsg
    return
  }
  const tempVal = value.value
  tempVal.push(newTag)
  value.value = tempVal
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
