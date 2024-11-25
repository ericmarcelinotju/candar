<template>
  <div class="navigation">
    <template v-for="item in navigations">
      <router-link
        v-if="!item.children"
        :key="item.name"
        class="group nav-button mb-2"
        :class="{
          '!hidden': item.module && !hasPermission(item.module),
          'justify-center': isCollapse,
        }"
        exact-active-class="is-active"
        :to="{ name: item.route || '' }"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          aria-hidden="true"
          class="h-6 w-6 text-base group hover:bg-white"
          exact-active-class="text-white"
        />
        <span
          v-if="!isCollapse || !item.icon"
          class="ml-4"
        >
          {{ item.name }}
        </span>
      </router-link>
      <Disclosure
        v-else
        :key="`parent-${item.name}`"
        v-slot="{ open }"
        as="div"
        class="space-y-1 mb-2"
        :class="{ '!hidden': !hasAnyPermission(item.children) }"
        :default-open="hasActiveChild(item.children)"
      >
        <DisclosureButton
          class="nav-button"
          exact-active-class="bg-white text-primary font-medium"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            aria-hidden="true"
            class="flex-shrink-0 h-6 w-6"
            :class="{ 'mr-4': !isCollapse }"
          />
          <div
            v-else
            class="h-6 w-6 group flex justify-center items-center"
          >
            <div class="h-[0.4rem] w-[0.4rem] rounded-full bg-black hover:bg-white" />
          </div>
          <span
            v-if="!isCollapse || !item.icon"
            class="flex-1"
          >
            {{ item.name }}
          </span>
          <svg
            aria-hidden="true"
            class="flex-shrink-0 h-5 w-5 transform group-hover:text-white transition-colors ease-in-out duration-150"
            :class="{ 'rotate-90': open, 'ml-3': !isCollapse }"
            viewBox="0 0 20 20"
          >
            <path
              d="M6 6L14 10L6 14V6Z"
              fill="currentColor"
            />
          </svg>
        </DisclosureButton>
        <DisclosurePanel class="space-y-1">
          <router-link
            v-for="subItem in item.children"
            :key="subItem.name"
            class="group nav-button"
            :class="{
              '!hidden': subItem.module && !hasPermission(subItem.module),
            }"
            exact-active-class="bg-white text-primary font-medium"
            :to="{ name: subItem.route }"
          >
            <component
              :is="subItem.icon"
              v-if="subItem.icon"
              aria-hidden="true"
              class="flex-shrink-0 h-6 w-6"
              :class="{ 'mr-4': !isCollapse }"
            />
            <div
              v-else-if="!isCollapse"
              class="h-6 w-6 group flex justify-center items-center"
            >
              <div class="h-[0.4rem] w-[0.4rem] rounded-full bg-black hover:bg-white" />
            </div>
            <span
              v-if="!isCollapse || !subItem.icon"
              class="text-ellipsis overflow-hidden"
              :class="{ 'ml-4': !isCollapse }"
            >
              {{ subItem.name }}
            </span>
          </router-link>
        </DisclosurePanel>
      </Disclosure>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Navigation } from '@/typings/navigation.type'

interface Props {
  navigations: Navigation[]
  isCollapse?: boolean
}

defineProps<Props>()
const route = useRoute()
const store = useStore()

const hasActiveChild = (children) => {
  return children.some((item) => item.href === route.path)
}

const hasPermission = (module) => {
  return store.getters['auth/hasPermission'](module, 'GET')
}

const hasAnyPermission = (children) => {
  for (const item of children) {
    if (store.getters['auth/hasPermission'](item.module, 'GET')) {
      return true
    }
  }
  return false
}
</script>

<style lang="scss" scoped>
.nav-button {
  @apply flex items-center w-full px-2 py-2 text-left text-base leading-6 rounded-md overflow-hidden whitespace-nowrap;

  &:hover, &.is-active {
    @apply shadow-md text-primary bg-white font-medium;
  }
}
</style>
