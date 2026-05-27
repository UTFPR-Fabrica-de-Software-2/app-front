<script setup lang="ts">
defineOptions({ name: 'PublicViewLayout' })
</script>

<template>
  <main class="min-h-full px-4 py-6 sm:px-6 lg:px-8">
    <slot />
    <router-view />
  </main>
</template>
