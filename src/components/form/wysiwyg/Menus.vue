<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="flex">
    <template
      v-for="(item, index) in menus"
      :key="index"
    >
      <div
        v-if="item.type === 'divider'"
        :key="`divider${index}`"
        class="divider"
      />
      <Popover
        v-else-if="item.type === 'popover'"
        class="relative"
      >
        <PopoverButton>
          <button
            class="control-button mr-2"
            :class="{ 'is-active': item.isActive ? item.isActive() : null }"
            :title="item.title"
          >
            <svg
              class="w-full h-full"
              v-html="item.icon"
            >
            </svg>
          </button>
        </PopoverButton>

        <PopoverPanel
          class="
            absolute
            z-10
            pt-2
            pl-2
            pb-1
            pr-1
            shadow-sm
            rounded-md
            bg-white
            border
          "
        >
          <component
            :is="item.popoverContent"
            :action="item.action"
            :title="item.title"
          />
        </PopoverPanel>
      </Popover>
      <button
        v-else
        class="control-button mr-2"
        :class="{ 'is-active': item.isActive ? item.isActive() : null }"
        :title="item.title"
        @click="item.action"
      >
        <svg
          class="w-full h-full"
          v-html="item.icon"
        >
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Component, Ref, ref } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import * as icons from './icons'

import ImagePopover from './ImagePopover.vue'
import TablePopover from './TablePopover.vue'

class Menu {
  icon?: string
  title?: string
  type?: string
  action?: (...args: unknown[]) => void
  isActive?: () => void
  popoverContent?: Component
}

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const menus: Ref<Menu[]> = ref([])
menus.value = [
  {
    icon: icons.bold,
    title: 'Bold',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold')
  },
  {
    icon: icons.italic,
    title: 'Italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic')
  },
  {
    icon: icons.strikethrough,
    title: 'Strike',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike')
  },
  {
    icon: icons.markPenLine,
    title: 'Highlight',
    action: () => props.editor.chain().focus().toggleHighlight().run(),
    isActive: () => props.editor.isActive('highlight')
  },
  { type: 'divider' },
  {
    type: 'popover',
    icon: icons.imageFill,
    title: 'Image',
    popoverContent: ImagePopover,
    action: (url) => props.editor.chain().focus().setImage({ src: url }).run(),
    isActive: () => false
  },
  { type: 'divider' },
  {
    type: 'popover',
    icon: icons.tableLine,
    title: 'Table',
    popoverContent: TablePopover,
    action: (rows, cols) => props.editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run(),
    isActive: () => false
  },
  {
    icon: icons.mergeCellsHorizontal,
    title: 'Merge',
    action: () => props.editor.chain().focus().mergeOrSplit().run(),
    isActive: () => props.editor.can().splitCell()
  },
  { type: 'divider' },
  {
    icon: icons.alignLeft,
    title: 'Left',
    action: () => props.editor.chain().focus().setTextAlign('left').run(),
    isActive: () => props.editor.isActive({ textAlign: 'left' })
  },
  {
    icon: icons.alignCenter,
    title: 'Center',
    action: () => props.editor.chain().focus().setTextAlign('center').run(),
    isActive: () => props.editor.isActive({ textAlign: 'center' })
  },
  {
    icon: icons.alignRight,
    title: 'Right',
    action: () => props.editor.chain().focus().setTextAlign('right').run(),
    isActive: () => props.editor.isActive({ textAlign: 'right' })
  },
  {
    icon: icons.alignJustify,
    title: 'Justify',
    action: () => props.editor.chain().focus().setTextAlign('justify').run(),
    isActive: () => props.editor.isActive({ textAlign: 'justify' })
  },
  { type: 'divider' },
  {
    icon: icons.h1,
    title: 'Heading 1',
    action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => props.editor.isActive('heading', { level: 1 })
  },
  {
    icon: icons.h2,
    title: 'Heading 2',
    action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => props.editor.isActive('heading', { level: 2 })
  },
  {
    icon: icons.paragraph,
    title: 'Paragraph',
    action: () => props.editor.chain().focus().setParagraph().run(),
    isActive: () => props.editor.isActive('paragraph')
  },
  {
    icon: icons.listUnordered,
    title: 'Bullet List',
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList')
  },
  {
    icon: icons.listOrdered,
    title: 'Ordered List',
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList')
  },
  { type: 'divider' },
  {
    icon: icons.doubleQuotes,
    title: 'Blockquote',
    action: () => props.editor.chain().focus().toggleBlockquote().run(),
    isActive: () => props.editor.isActive('blockquote')
  },
  {
    icon: icons.separator,
    title: 'Horizontal Rule',
    action: () => props.editor.chain().focus().setHorizontalRule().run()
  },
  { type: 'divider' },
  {
    icon: icons.textWrap,
    title: 'Hard Break',
    action: () => props.editor.chain().focus().setHardBreak().run()
  },
  {
    icon: icons.formatClear,
    title: 'Clear Format',
    action: () => props.editor.chain()
      .focus()
      .clearNodes()
      .unsetAllMarks()
      .run()
  },
  { type: 'divider' },
  {
    icon: icons.undo,
    title: 'Undo',
    action: () => props.editor.chain().focus().undo().run()
  },
  {
    icon: icons.redo,
    title: 'Redo',
    action: () => props.editor.chain().focus().redo().run()
  }
]
</script>
