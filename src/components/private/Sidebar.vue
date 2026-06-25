<script setup lang="ts">
defineOptions({ name: 'CompPrivateSidebar' })

import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'

import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'
import CardUser from '../cards/CardUser.vue'

interface NavigationItem {
  label: string
  description?: string
  icon: string
  to: string
}

interface Props {
  user: UserMeResInterface['me'] | null
  navigation: NavigationItem[]
  title: string
  subtitle: string
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function closeSidebar(): void {
  emit('update:open', false)
}
</script>

<template>
  <aside class="hidden w-80 shrink-0 border-r border-slate-200 bg-white/95 lg:flex lg:flex-col">
    <div class="flex h-full flex-col px-5 py-6">
      <CardUser :user="props.user" />

      <nav class="mt-6 space-y-2">
        <RouterLink
          v-for="item in props.navigation"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            class="group flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors"
            :class="
              isActive
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <i :class="[item.icon, 'mt-0.5 text-base']" />

            <div class="min-w-0 flex-1">
              <span class="block font-medium">{{ item.label }}</span>
            </div>

            <i
              class="pi pi-chevron-right mt-1 text-xs text-inherit/50 transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </RouterLink>
      </nav>
    </div>
  </aside>

  <Drawer
    :visible="props.open"
    position="left"
    class="w-full max-w-sm lg:hidden"
    :dismissable="true"
    :blockScroll="true"
    @update:visible="emit('update:open', $event)"
  >
    <div class="flex h-full flex-col px-1 pb-2 pt-1">
      <CardUser :user="props.user" />

      <nav class="mt-5 space-y-2">
        <RouterLink
          v-for="item in props.navigation"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="
              () => {
                navigate()
                closeSidebar()
              }
            "
            class="group flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors"
            :class="
              isActive
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <i :class="[item.icon, 'mt-0.5 text-base']" />

            <span class="min-w-0 flex-1">
              <span class="block font-medium">{{ item.label }}</span>
              <span class="mt-0.5 block text-sm text-inherit/70">{{ item.description }}</span>
            </span>

            <i class="pi pi-chevron-right mt-1 text-xs text-inherit/50" />
          </a>
        </RouterLink>
      </nav>
    </div>
  </Drawer>
</template>
