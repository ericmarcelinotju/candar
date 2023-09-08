<template>
  <div
    id="app-body"
    class="min-h-full"
  >
    <DefaultHeader
      id="header"
      @about="handleAbout"
      @logout="handleLogout"
      @notification="handleNotification"
      @open-sidebar="handleOpenSidebar"
    />
    <DefaultSidebar
      :is-collapse="isSidebarCollapse"
      :is-open="isSidebarOpen"
      @close="handleCloseSidebar"
      @collapse="toogleCollapseSidebar"
    />
    <div
      class="lg:pl-72 h-screen bg-grey-soft flex flex-col flex-1 pb-20 transition-all ease-out"
      :class="{ 'lg:pl-24': isSidebarCollapse }"
    >
      <main class="flex-1 overflow-y-scroll">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            name="fade"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <!-- <DefaultFooter id="footer" /> -->
    </div>
    <DefaultModal
      v-if="currNotification"
      v-model="visibleNotificationModal"
      :confirm-text="$t('global.ok')"
      :description="currNotification.subject"
      :has-cancel="false"
      :has-icon="false"
      :title="currNotification.title"
      type="success"
    >
      <div
        class="border rounded-md mt-4 p-3"
        v-html="currNotification.content"
      />
    </DefaultModal>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { useStore } from 'vuex'
import DefaultHeader from './Header.vue'
// import DefaultFooter from './Footer.vue'
import DefaultSidebar from './sidebar/Sidebar.vue'
import { config } from '@/config'
import { Log } from '@/typings/models/log.type'

const store = useStore()

const isSidebarOpen = ref(false)

const handleOpenSidebar = () => {
  isSidebarOpen.value = true
}

const handleCloseSidebar = () => {
  isSidebarOpen.value = false
}

const isSidebarCollapse = ref(false)

const toogleCollapseSidebar = () => {
  isSidebarCollapse.value = !isSidebarCollapse.value
}

const visibleNotificationModal = ref(false)
const currNotification: Ref<Log> = ref(null)

const handleLogout = () => {
  store.dispatch('auth/logout')
}

const handleNotification = (notification) => {
  visibleNotificationModal.value = true
  currNotification.value = notification
  store.commit('notification/readNotification', notification.id)
}

const handleAbout = () => {
  // window.open(config.aboutUrl, '_blank').focus()
}
</script>
