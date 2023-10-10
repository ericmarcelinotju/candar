<template>
  <div class="flex-shrink-0 flex h-20 bg-info shadow-lg border-none">
    <button
      class="px-6 text-grey-dark focus:outline-none focus:ring-1 focus:ring-inset focus:ring-white lg:hidden hover:bg-secondary-dark focus:bg-secondary-dark hover:text-white"
      type="button"
      @click="openSidebar"
    >
      <span class="sr-only">Open sidebar</span>
      <MenuAlt1Icon
        aria-hidden="true"
        class="h-6 w-6"
      />
    </button>
    <!-- Search bar -->
    <div class="flex-1 px-4 flex justify-between sm:px-6 lg:mx-auto lg:px-6">
      <div class="flex-1 flex items-center" />
      <div class="ml-4 flex items-center md:ml-6">
        <Menu
          as="div"
          class="ml-3 relative"
        >
          <div>
            <MenuButton class="menu-button">
              <BellIcon
                aria-hidden="true"
                class="h-6 w-6"
              />
              <div
                v-if="notifications.length > 0"
                class="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger"
              />
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="origin-top-right absolute right-0 mt-4 w-52 z-10 rounded-md shadow-lg py-1 z-10 bg-info ring-1 ring-grey-dark focus:outline-none"
            >
              <MenuItem v-if="notifications.length <= 0">
                <span
                  class="block px-4 py-2 text-sm text-grey-dark cursor-pointer"
                >{{ $t('app.components.notification.empty') }}</span>
              </MenuItem>
              <MenuItem
                v-for="notification in notifications"
                v-else
                :key="notification.id"
                v-slot="{ active }"
              >
                <a
                  :class="[
                    active ? 'bg-white' : '',
                    'block px-4 py-2 text-grey cursor-pointer'
                  ]"
                  @click="handleNotification(notification)"
                >
                  <div class="font-bold">
                    {{ notification.title }}
                  </div>
                  <div
                    class="text-sm whitespace-nowrap text-ellipsis overflow-hidden"
                  >
                    {{ notification.subject }}
                  </div>
                </a>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Profile dropdown -->
        <Menu
          as="div"
          class="ml-3 relative"
        >
          <div>
            <MenuButton class="menu-button">
              <UserIcon class="h-6 w-6" />
              <ChevronDownIcon
                aria-hidden="true"
                class="hidden flex-shrink-0 ml-1 h-5 w-5 lg:block"
              />
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="origin-top-right absolute right-0 mt-4 w-48 rounded-md shadow-lg z-10 bg-info ring-1 ring-grey-dark focus:outline-none overflow-hidden"
            >
              <MenuItem v-slot="{ active }">
                <a
                  :class="[
                    active ? 'bg-info-dark' : '',
                    'block px-4 py-2 text-grey-dark'
                  ]"
                >
                  <div class="mb-2">
                    <b>{{ user?.role?.name }}</b>
                  </div>
                  <div>{{ user.username }}</div>
                </a>
              </MenuItem>
              <hr>
              <MenuItem v-slot="{ active }">
                <a
                  :class="[
                    active ? 'bg-info-dark' : '',
                    'block px-4 py-2 text-grey-dark cursor-pointer flex items-center'
                  ]"
                  @click="handleLogout"
                >
                  <LogoutIcon class="h-6 w-6 rounded-full mr-4" />
                  <span>{{ $t('global.logout') }}</span>
                </a>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'
import {
  BellIcon,
  MenuAlt1Icon,
  UserIcon,
  LogoutIcon
} from '@heroicons/vue/outline'
import { useStore } from 'vuex'

const emit = defineEmits(['openSidebar', 'logout', 'notification'])

const store = useStore()

const user = computed(() => store.getters['auth/user'])
const notifications = computed(() => [])

const openSidebar = () => {
  emit('openSidebar')
}

const handleLogout = () => {
  emit('logout')
}

const handleNotification = (notification) => {
  emit('notification', notification)
}
</script>

<style lang="scss" scoped>
.menu-button {
  @apply max-w-xs rounded-full lg:rounded-md flex items-center text-sm p-1 lg:p-2 hover:bg-secondary focus:bg-secondary text-grey-dark hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white;
}
</style>
