<template>
  <TransitionRoot
    as="template"
    :show="value"
  >
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      :open="value"
      @close="close"
    >
      <div
        class="
          flex
          items-end
          justify-center
          min-h-screen
          pt-4
          px-4
          pb-20
          text-center
          sm:block sm:p-0
        "
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <span
          aria-hidden="true"
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >
          &#8203;
        </span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6
            "
          >
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
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
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:mx-0 sm:h-10 sm:w-10
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
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { toRef } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
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
