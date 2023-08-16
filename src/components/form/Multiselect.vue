<template>
  <div class="custom-multiselect">
    <multiselect
      v-bind="$attrs"
      :multiple="true"
    />
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect'
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
