<script setup lang="ts">
import { Divider } from 'primevue'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'
import Avatar from '../Avatar.vue'

const props = defineProps<{
  user: UserMeResInterface['me'] | null
}>()
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
    <div class="flex items-center gap-3">
      <Avatar
        :username="props.user?.name || 'Usuário autenticado'"
        :src-img="props.user?.avatarUrl || undefined"
      />

      <div class="min-w-0">
        <p class="truncate font-semibold text-slate-900">
          {{ props.user?.name ?? 'Usuário autenticado' }}
        </p>
        <p class="truncate text-sm text-slate-500">
          {{ props.user?.email ?? 'Detalhes do perfil serão carregados em instantes' }}
        </p>
      </div>
    </div>

    <Divider />

    <dl class="grid gap-3 text-sm">
      <div class="flex items-start gap-2">
        <dt class="text-slate-500">Curso:</dt>
        <dd class="font-medium text-slate-900">
          {{ props.user?.course ?? 'Não informado' }}
        </dd>
      </div>
      <div class="flex items-start gap-2">
        <dt class="text-slate-500">Campus:</dt>
        <dd class="font-medium text-slate-900">
          {{ props.user?.campus ?? 'Não informado' }}
        </dd>
      </div>
    </dl>
  </div>
</template>
