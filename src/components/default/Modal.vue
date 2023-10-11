<template>
  <TransitionRoot
    appear
    as="template"
    :show="value"
  >
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6
            "
              :class="className"
            >
              <div class="hidden sm:block absolute z-50 top-0 right-0 pt-4 pr-4">
                <button
                  class="
                  bg-white
                  rounded-md
                  text-gray-400
                  hover:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-grey-soft
                "
                  type="button"
                  @click="close"
                >
                  <span class="sr-only">Close</span>
                  <XIcon
                    aria-hidden="true"
                    class="h-6 w-6"
                  />
                </button>
              </div>
              <div class="sm:flex sm:items-start">
                <div
                  v-if="hasIcon"
                  class="
                    mr-3
                    flex-shrink-0 flex
                    items-center
                    justify-center
                    h-12
                    w-12
                    rounded-full
                    sm:h-10 sm:w-10
                    bg-grey-soft
                  "
                >
                  <ExclamationIcon
                    aria-hidden="true"
                    class="`h-6 w-6 text-grey`"
                  />
                </div>
                <div class="w-full text-center sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-lg leading-6 font-medium text-gray-900 font-bold"
                  >
                    {{ title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ description }}
                    </p>
                  </div>
                  <slot />
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  v-if="hasConfirm"
                  :class="`${type}-button`"
                  :disabled="loading"
                  type="button"
                  @click="confirm"
                >
                  <Loading v-if="loading" />
                  {{ confirmText }}
                </button>
                <button
                  v-if="hasCancel"
                  class="default-button mr-6"
                  type="button"
                  @click="close"
                >
                  {{ cancelText }}
                </button>
                <slot name="action" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { toRef } from 'vue'
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { ExclamationIcon, XIcon } from '@heroicons/vue/outline'
import i18n from '@/plugins/i18n'
import { DisplayType } from '@/typings/display.type'

const { t } = i18n.global

const defaultTitle = t('app.components.modal.title')
const defaultDescription = t('app.components.modal.description')
const defaultConfirmText = t('app.components.modal.confirm')
const defaultCancelText = t('app.components.modal.cancel')

export default {}
</script>

<script setup lang="ts">
interface Props {
  className: string
  modelValue: boolean
  type?: DisplayType
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading: boolean
  hasCancel?: boolean
  hasConfirm?: boolean
  hasIcon?: boolean
  isCloseOnConfirm?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  title: defaultTitle,
  description: defaultDescription,
  confirmText: defaultConfirmText,
  cancelText: defaultCancelText,
  hasCancel: true,
  hasConfirm: true,
  hasIcon: true,
  isCloseOnConfirm: true
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const value = toRef(props, 'modelValue')

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirm = () => {
  if (props.isCloseOnConfirm) {
    close()
  }
  emit('confirm')
}
</script>
