<template>
  <div>
    <TabGroup>
      <TabList class="flex">
        <Tab
          v-for="option in options"
          :key="option.value"
          v-slot="{ selected }"
          class="outline-0"
        >
          <button
            class="relative top-[1px] py-2 px-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 text-gray-500 font-medium"
            :class="[selected && 'bg-white text-info border-t border-x border-gray-300', buttonClass]"
          >
            {{ option.label }}
          </button>
        </Tab>
      </TabList>
      <TabPanels class="border-t border-gray-300">
        <TabPanel
          v-for="option in options"
          :key="option.value"
          class="outline-0"
        >
          <slot :name="option.value" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Option } from '@/typings/option.type'

interface Props {
  options: Option[];
  buttonClass?: string;
}
defineProps<Props>()
</script>
