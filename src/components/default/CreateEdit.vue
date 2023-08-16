<template>
  <form
    class="h-full flex flex-col justify-between mt-2"
    @reset.prevent="onReset"
    @submit.prevent="onSubmit"
  >
    <div class="grid grid-flow-row auto-rows-auto gap-4">
      <template
        v-for="(row, i) in formSettings"
        :key="`row-${i}`"
      >
        <div
          v-if="(Array.isArray(row))"
          class="grid sm:grid-flow-col auto-cols-auto gap-4"
        >
          <div
            v-for="(column, j) in row"
            :key="`column-${j}`"
            class="default-field"
            :class="{ 'inline': column.type === 'checkbox' }"
          >
            <template v-if="$slots[row.key]">
              <slot
                :form="form"
                :form-setting="row"
                :name="row.key"
              />
            </template>
            <template v-else>
              <label
                class="default-label"
                :for="column.key"
              >
                {{ column.label }}<sup v-if="column.isRequired">*</sup>
              </label>
              <Input
                :id="column.key"
                v-model="form[column.key]"
                :autocomplete="column.autocomplete"
                :options="(column.options as Option[])"
                :required="column.isRequired"
                :type="column.type"
              />
              <span
                v-show="isDirty"
                class="default-input-message is-danger"
              >
                {{ validation[column.key]?.message }}
              </span>
            </template>
          </div>
        </div>
        <div
          v-else
          class="default-field"
          :class="{ 'inline': row.type === 'checkbox' }"
        >
          <template v-if="$slots[row.key]">
            <slot
              :form="form"
              :form-setting="row"
              :name="row.key"
            />
          </template>
          <template v-else>
            <label
              class="default-label"
              :for="row.key"
            >
              {{ row.label }}<sup v-if="row.isRequired">*</sup>
            </label>
            <Input
              :id="row.key"
              v-model="form[row.key]"
              :autocomplete="row.autocomplete"
              :options="(row.options as Option[])"
              :required="row.isRequired"
              :type="row.type"
            />
            <span
              v-show="isDirty"
              class="default-input-message is-danger"
            >
              {{ validation[row.key]?.message }}
            </span>
          </template>
        </div>
      </template>
    </div>
    <div class="create-edit-submit-container">
      <button
        class="default-button mr-4"
        type="reset"
      >
        {{ $t("app.reset") }}
      </button>
      <button
        class="success-button"
        type="submit"
      >
        <Loading v-if="loading" />
        {{ $t("app.save") }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts" generic="T">
import { watch } from 'vue'
import { FormSetting } from '@/typings/form.type'
import { useForm } from '@/composables/use-form'
import Loading from '@/components/helper/Loading.vue'
import Input from '@/components/form/Input.vue'
import { Option } from '@/typings/option.type'

interface Props {
  formSettings: FormSetting[]
  initialData?: T
}

const props = defineProps<Props>()
const emit = defineEmits(['submit'])

const onReset = () => {
  reset()
  form.value = { ...props.initialData }
}

const onSubmit = () => {
  loading.value = true
  touch()
  if (!validation.value.isValid) {
    loading.value = false
    return
  }

  emit('submit', form, () => {
    reset()
    loading.value = false
  })
}

const {
  isDirty,
  form,
  validation,
  loading,
  reset,
  touch
} = useForm<T>(props.formSettings)

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = { ...val }
    }
  },
  { immediate: true }
)
</script>
