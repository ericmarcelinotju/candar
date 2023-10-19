<template>
  <div
    :class="className ? className : 'default-input flex flex-col min-h-[40px]'"
    :disabled="props.disabled"
    style="background-color: white;"
    type="text"
  >
    <div class="flex flex-row flex-wrap">
      <div
        v-for="(e, i) in modelValue"
        :key="`tags-${i}`"
        class="flex flex-row my-1 mx-1 bg-primary rounded-lg hover:cursor-pointer"
      >
        <p
          class="text-white py-1 px-2"
        >
          {{ e.name }}
        </p>
        <div
          class="flex flex-col p-1 hover:bg-red-600 active:bg-red-700 transition duration-250 rounded-r-lg"
          @click="() => handleRemoveVariant(e.id)"
        >
          <MinusSmIcon class="w-5 h-5 text-white" />
        </div>
      </div>
      <Popover
        v-slot="{ open, close }"
        class="relative flex flex-col justify-center"
      >
        <PopoverButton
          v-if="isOptionsAvailable"
          class="ml-1 group inline-flex items-center rounded-md secondary-button px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          :class="open ? '' : 'text-opacity-90'"
        >
          <PlusIcon class="w-3 h-3" />
        </PopoverButton>

        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <!-- v-if="isOptionsAvailable" -->
          <PopoverPanel
            class="absolute z-10 mt-2 min-w-[260px] max-w-sm -translate-x-1/4 transform px-4 sm:px-0 lg:max-w-3xl"
          >
            <div
              class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <div class="relative bg-white p-4 flex flex-col space-y-2">
                <Disclosure
                  v-for="(category, indexCategory) in options"
                  :key="category.name"
                  v-slot="{ open2 }"
                >
                  <template v-if="isDisable(category.disabled)">
                    <DisclosureButton

                      class="flex w-full hover:bg-gray-300 bg-gray-100 justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
                      :class="{ 'bg-gray-300': open2 }"
                    >
                      <span>{{ category.name }}</span>
                      <ChevronUpIcon
                        class="h-5 w-5 "
                        :class="open2 ? 'rotate-180 transform' : ''"
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      class="px-4 text-sm text-gray-500"
                    >
                      <template v-for="(variant, indexVariant) in category.variant">
                        <div
                          v-if="isDisable(variant.disabled)"
                          :key="`label-${indexVariant}`"
                          class="flex flex-col"
                          @click="() => handleClick(variant, category, indexCategory, indexVariant, close, index)"
                        >
                          <p class="hover:cursor-pointer hover:bg-gray-300 m-0 p-2 rounded-md">
                            {{ variant.name }}
                          </p>
                        </div>
                      </template>
                    </DisclosurePanel>
                  </template>
                </Disclosure>
              </div>
            </div>
          </PopoverPanel>
        </transition>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OptionObject } from '../../../typings/option.type'
// import { Variant } from '@/typings/models/variant.type'

import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon, PlusIcon, MinusSmIcon } from '@heroicons/vue/solid'

interface Props {
  options: OptionObject[]
  className?: string
  modelValue?: { id: string, name: string, disabled: boolean }[]
  disabled?: boolean,
  index?: number,
  callbackFn?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  modelValue: () => { return [{ id: '', name: '', disabled: false }] },
  disabled: false,
  index: null,
  callbackFn: () => {
    return {}
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'update-options', 'delete-variant'])

const isDisable = (disable: boolean) => {
  return !disable
}

const handleRemoveVariant = (e: string) => {
  if (!e) return

  const payload = {
    id: e,
    index: props.index
  }
  emit('delete-variant', payload as { id: string, index: number })
}

const handleClick = (variant: { id: string, name: string, disabled: boolean }, category: OptionObject, indexCategory: number, indexVariant: number, close: () => void, index: number) => {
  const tempVariant = { ...variant }
  tempVariant.name = `${category.name}: ${tempVariant.name}`

  const value: { id: string, name: string, disabled: boolean }[] = [...props.modelValue, { ...tempVariant }]

  emit('update:modelValue', value)
  emit('input', value)
  emit('update-options', {
    indexCategory,
    indexVariant,
    index
  })
  close && close()
}
const isOptionsAvailable = computed(() => props.options.length > 0 && props.options.some((element: OptionObject) => !element.disabled))
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
