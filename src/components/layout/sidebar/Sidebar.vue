<template>
  <div>
    <TransitionRoot
      as="template"
      :show="isOpen"
    >
      <Dialog
        as="div"
        class="fixed inset-0 flex z-40 lg:hidden"
        @close="onClose"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <div class="relative flex-1 flex flex-col max-w-xs w-full bg-info">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  type="button"
                  @click="onClose"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XIcon
                    aria-hidden="true"
                    class="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            <div class="flex-shrink-0 flex items-center px-4">
              <router-link
                class="py-4"
                to="/"
              >
                <img
                  alt="Logo"
                  class="inline h-12 w-auto mr-2"
                  src="@/assets/logo.svg"
                >
                <h1 class="inline text-black text-xl font-semibold">
                  Volt
                </h1>
              </router-link>
            </div>
            <nav
              aria-label="Sidebar"
              class="mt-5 flex-1 flex flex-col divide-y divide-grey-dark overflow-y-auto"
            >
              <div class="px-4 space-y-1">
                <DefaultNavigation :navigations="navigations" />
              </div>
              <div class="px-4 space-y-1 mt-4 pt-4 pb-4">
                <DefaultNavigation :navigations="secondaryNavigations" />
              </div>
            </nav>
          </div>
        </TransitionChild>
        <div
          aria-hidden="true"
          class="flex-shrink-0 w-14"
        >
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:flex flex-col w-72 fixed inset-y-0 shadow-lg transition-all ease-out"
      :class="{ 'w-24': isCollapse }"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col flex-grow bg-info shadow-lg overflow-y-auto">
        <div
          class="flex items-center justify-between flex-shrink-0 px-4 max-h-20"
        >
          <router-link
            class="flex items-center my-4 overflow-hidden"
            to="/"
          >
            <img
              alt="Logo"
              class="h-12 w-auto mr-2"
              src="@/assets/logo.svg"
            >
            <h1
              v-if="!isCollapse"
              class="text-black text-xl font-semibold"
            >
              Volt
            </h1>
          </router-link>

          <button>
            <ArrowNarrowLeftIcon
              class="h-6 w-6"
              :class="{ 'rotate-180': isCollapse }"
              @click="onCollapse"
            />
          </button>
        </div>
        <nav
          aria-label="Sidebar"
          class="mt-5 flex-1 flex flex-col divide-y divide-grey-dark overflow-y-auto"
        >
          <div class="px-4 space-y-1">
            <DefaultNavigation
              :is-collapse="isCollapse"
              :navigations="navigations"
            />
          </div>
          <div class="px-4 space-y-1 mt-4 pt-4 pb-4">
            <DefaultNavigation
              :is-collapse="isCollapse"
              :navigations="secondaryNavigations"
            />
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon, ArrowNarrowLeftIcon } from '@heroicons/vue/solid'
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { navigations, secondaryNavigations } from './config'
import DefaultNavigation from './Navigation.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'collapse'])

const onClose = () => {
  emit('close')
}

const onCollapse = () => {
  emit('collapse')
}
</script>
