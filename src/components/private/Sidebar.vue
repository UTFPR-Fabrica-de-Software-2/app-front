<script setup lang="ts">
defineOptions({ name: 'CompPrivateSidebar' })

import { RouterLink } from 'vue-router'
import Avatar from 'primevue/avatar'
import Drawer from 'primevue/drawer'
import Divider from 'primevue/divider'

import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

interface NavigationItem {
  label: string
  description: string
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

function getInitials(name: string | undefined): string {
  if (!name) return 'US'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function closeSidebar(): void {
  emit('update:open', false)
}
</script>

<template>
  <aside class="hidden w-80 shrink-0 border-r border-slate-200 bg-white/95 lg:flex lg:flex-col">
    <div class="flex h-full flex-col px-5 py-6">
      <div class="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div class="flex items-center gap-3">
          <Avatar
            :label="getInitials(user?.name)"
            :image="user?.avatarUrl || undefined"
            shape="circle"
            class="h-12 w-12 border border-slate-200 bg-white text-sm text-slate-700"
          />

          <div class="min-w-0">
            <p class="truncate font-semibold text-slate-900">
              {{ user?.name ?? 'Usuário autenticado' }}
            </p>
            <p class="truncate text-sm text-slate-500">
              {{ user?.email ?? 'Detalhes do perfil serão carregados em instantes' }}
            </p>
          </div>
        </div>

        <Divider class="my-4" />

        <dl class="grid gap-3 text-sm">
          <div class="flex items-start justify-between gap-4">
            <dt class="text-slate-500">Curso</dt>
            <dd class="text-right font-medium text-slate-900">
              {{ user?.course ?? 'Não informado' }}
            </dd>
          </div>
          <div class="flex items-start justify-between gap-4">
            <dt class="text-slate-500">Campus</dt>
            <dd class="text-right font-medium text-slate-900">
              {{ user?.campus ?? 'Não informado' }}
            </dd>
          </div>
        </dl>
      </div>

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

            <span class="min-w-0 flex-1">
              <span class="block font-medium">{{ item.label }}</span>
              <span class="mt-0.5 block text-sm text-inherit/70">{{ item.description }}</span>
            </span>

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
      <div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div class="flex items-center gap-3">
          <Avatar
            :label="getInitials(user?.name)"
            :image="user?.avatarUrl || undefined"
            shape="circle"
            class="border border-slate-200 bg-white text-sm text-slate-700"
          />

          <div class="min-w-0">
            <p class="truncate font-semibold text-slate-900">
              {{ user?.name ?? 'Usuário autenticado' }}
            </p>
            <p class="truncate text-sm text-slate-500">
              {{ user?.email ?? 'Detalhes do perfil serão carregados em instantes' }}
            </p>
          </div>
        </div>
      </div>

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
