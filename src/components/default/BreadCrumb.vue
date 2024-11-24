<template>
  <nav class="breadcrumb">
    <ul>
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        :class="{ 'is-active': crumb.isActive }"
      >
        <router-link :to="crumb.to">
          {{ crumb.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched

  return matchedRoutes.filter((routeItem) => routeItem.meta.title || routeItem.name).map((routeItem) => ({
    label: routeItem.meta.title || routeItem.name,
    to: routeItem.path,
    isActive: route.name === routeItem.name
  }))
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  @apply text-sm;
  ul {
    @apply flex gap-x-3;

    li {
      position: relative;
      padding-right: 14px;

      &.is-active {
        pointer-events: none;
        @apply text-primary;
      }
    }

    li:not(:last-child)::after {
      @apply bg-neutral-100;
      content: '';
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 3px;
      border-radius: 50%; /* Makes the dot circular */
    }
  }
}
</style>
