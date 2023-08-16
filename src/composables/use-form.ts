import { ref, computed, Ref } from 'vue'
import { trim } from 'lodash'
import { FormSetting } from '@/typings/form.type'
import { ValidationItem, ValidationResult } from '@/typings/validation.type'
import { AppSetting } from '@/typings/models/setting.type'

class Factory {
  create<T> (Type: (new () => T)): T {
    return new Type()
  }
}

const useForm = <T>(formSetting?: FormSetting[]) => {
  const isDirty = ref(false)
  const loading = ref(false)

  const extractForm = (formSetting: FormSetting[]): T => {
    const result: T = {} as T

    for (let i = 0; i < formSetting.length; i++) {
      const item = formSetting[i]

      if (Array.isArray(item)) {
        result[item.key] = extractForm(item)
      } else {
        result[item.key] = item.default || null
      }
    }
    return result
  }

  const form: Ref<T> = ref()
  if (formSetting) {
    form.value = extractForm(formSetting)
  }

  const validation: Ref<ValidationResult<T>> = computed(() => {
    let isValid = true
    const validationItem = {} as Record<keyof T, ValidationItem>

    for (let i = 0; i < formSetting.length; i++) {
      const item = formSetting[i]

      validationItem[item.key] = new ValidationItem()

      if (!item.rules) {
        continue
      }

      for (let j = 0; j < item.rules.length; j++) {
        const currRule = item.rules[j]
        if ((form.value[item.key] != null || isDirty.value === true) && !currRule(trim(form.value[item.key] as string))) {
          isValid = false
          validationItem[item.key] = {
            isValid: false,
            message: `${item.key} ${currRule.name} validation fail`
          }
          break
        }
      }
    }

    return {
      isValid,
      ...validationItem
    }
  })

  const reset = () => {
    isDirty.value = false
  }

  const touch = () => {
    isDirty.value = true
  }

  return {
    form,
    validation,
    loading,
    reset,
    touch,
    isDirty
  }
}

export {
  useForm
}
