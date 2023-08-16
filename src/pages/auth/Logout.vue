<template>
  <div>You shouldn't be here</div>
</template>
  
<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
store.dispatch('auth/logout')
</script>
  