<script setup lang="ts">
defineOptions({ name: 'PrivateViewLayout' })

import { onBeforeMount, ref } from 'vue'

import Navbar from '@/components/private/Navbar.vue'
import Sidebar from '@/components/private/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()
const sidebarOpen = ref(false)

const navigation = [
  {
    label: 'Painel',
    description: 'Resumo da área autenticada',
    icon: 'pi pi-th-large',
    to: '/app',
  },
]

function logout() {
  authStore.$reset()
}

onBeforeMount(() => {
  userStore.actMe()
})
</script>

<template>
  <div class="min-h-full bg-slate-100/70 lg:flex">
    <Sidebar
      v-model:open="sidebarOpen"
      :user="userStore.user"
      :navigation="navigation"
      title="Central do aluno"
      subtitle="Sakai-inspired"
    />

    <div class="flex min-h-full min-w-0 flex-1 flex-col">
      <Navbar
        :user="userStore.user"
        title="Central do aluno"
        @menu-click="sidebarOpen = true"
        @logout="logout"
      />

      <main class="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <slot />
        <router-view />
      </main>
    </div>
  </div>
</template>
