<script setup lang="ts">
defineOptions({ name: 'PrivateViewLayout' })

import { onBeforeMount } from 'vue'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

function logout() {
  authStore.$reset()
}

onBeforeMount(() => {
  userStore.actMe()
})
</script>

<template>
  <div class="min-h-full px-4 py-6 sm:px-6 lg:px-8">
    <nav class="flex justify-end py-4">
      <Button severity="info" @click="logout">Logout</Button>
    </nav>

    <main class="space-y-6">
      <slot />
      <router-view />
    </main>
  </div>
</template>
