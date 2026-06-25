<script setup lang="ts">
defineOptions({ name: 'PrivateUsers' })

import { computed, ref } from 'vue'

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import Avatar from '@/components/Avatar.vue'

type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT'

interface UserListItem {
  id: string
  name: string
  email: string
  course: string
  campus: string
  avatarUrl: string
  role: UserRole
  isVerified: boolean
  createdAt: string
}

const toast = useToast()
const confirm = useConfirm()

const ROLE_META: Record<UserRole, { label: string; severity: 'info' | 'warn' | 'secondary' }> = {
  ADMIN: { label: 'Administrador', severity: 'info' },
  PROFESSOR: { label: 'Professor', severity: 'warn' },
  STUDENT: { label: 'Estudante', severity: 'secondary' },
}

// TODO: substituir pelos dados vindos do endpoint do back-end.
const users = ref<UserListItem[]>([
  {
    id: '001',
    name: 'João Pedro',
    email: 'joao.pedro@alunos.utfpr.edu.br',
    course: 'Engenharia de Software',
    campus: 'Cornélio Procópio',
    avatarUrl: '',
    role: 'STUDENT',
    isVerified: false,
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: '002',
    name: 'Paula Almeida',
    email: 'paula.almeida@utfpr.edu.br',
    course: 'Ciência da Computação',
    campus: 'Curitiba',
    avatarUrl: '',
    role: 'PROFESSOR',
    isVerified: true,
    createdAt: '2023-08-11T10:00:00Z',
  },
  {
    id: '003',
    name: 'Patricia Souza',
    email: 'patricia.souza@utfpr.edu.br',
    course: 'Análise e Desenvolvimento de Sistemas',
    campus: 'Pato Branco',
    avatarUrl: '',
    role: 'ADMIN',
    isVerified: true,
    createdAt: '2022-08-11T10:00:00Z',
  },
  {
    id: '004',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@alunos.utfpr.edu.br',
    course: 'Engenharia de Computação',
    campus: 'Toledo',
    avatarUrl: '',
    role: 'STUDENT',
    isVerified: true,
    createdAt: '2022-10-12T10:00:00Z',
  },
  {
    id: '005',
    name: 'Kevin Oliveira',
    email: 'kevin.oliveira@alunos.utfpr.edu.br',
    course: 'Sistemas de Informação',
    campus: 'Campo Mourão',
    avatarUrl: '',
    role: 'STUDENT',
    isVerified: true,
    createdAt: '2025-11-11T10:00:00Z',
  },
  {
    id: '006',
    name: 'Amanda Lima',
    email: 'amanda.lima@alunos.utfpr.edu.br',
    course: 'Engenharia de Software',
    campus: 'Cornélio Procópio',
    avatarUrl: '',
    role: 'STUDENT',
    isVerified: false,
    createdAt: '2026-02-22T10:00:00Z',
  },
  {
    id: '007',
    name: 'Paulo Mendes',
    email: 'paulo.mendes@utfpr.edu.br',
    course: 'Ciência da Computação',
    campus: 'Curitiba',
    avatarUrl: '',
    role: 'PROFESSOR',
    isVerified: true,
    createdAt: '2025-07-17T10:00:00Z',
  },
])

const filters = ref({
  global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
})

const roleFilter = ref<UserRole | null>(null)
const roleOptions = (Object.keys(ROLE_META) as UserRole[]).map((value) => ({
  value,
  label: ROLE_META[value].label,
}))

const filteredUsers = computed(() =>
  roleFilter.value ? users.value.filter((user) => user.role === roleFilter.value) : users.value,
)

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

function confirmDelete(user: UserListItem): void {
  confirm.require({
    header: 'Excluir usuário',
    message: `Tem certeza que deseja excluir "${user.name}"? Esta ação não poderá ser desfeita.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Excluir', severity: 'danger' },
    accept: () => deleteUser(user),
  })
}

function deleteUser(user: UserListItem): void {
  // TODO: chamar o endpoint de exclusão do back-end.
  users.value = users.value.filter((item) => item.id !== user.id)
  toast.add({
    severity: 'success',
    summary: 'Usuário excluído',
    detail: `${user.name} foi removido com sucesso.`,
    life: 3000,
  })
}
</script>

<template>
  <section class="space-y-4">
    <header class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-slate-900">Usuários</h1>
      <p class="text-sm text-slate-500">
        Visualize, pesquise e gerencie os usuários cadastrados no sistema.
      </p>
    </header>

    <ConfirmDialog />

    <DataTable
      v-model:filters="filters"
      :value="filteredUsers"
      data-key="id"
      paginator
      :rows="10"
      :rows-per-page-options="[10, 25, 50]"
      :global-filter-fields="['name', 'email', 'course', 'campus']"
      removable-sort
      striped-rows
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <IconField class="w-full sm:max-w-xs">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.global.value"
              placeholder="Pesquise por nome, e-mail, curso..."
              class="w-full"
            />
          </IconField>

          <Select
            v-model="roleFilter"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            placeholder="Todos os perfis"
            show-clear
            class="w-full sm:w-56"
          />
        </div>
      </template>

      <template #empty>
        <div class="py-8 text-center text-slate-500">Nenhum usuário encontrado.</div>
      </template>

      <Column field="id" header="Código" sortable class="w-24" />

      <Column field="name" header="Usuário" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <Avatar :username="data.name" :src-img="data.avatarUrl || undefined" />
            <div class="min-w-0">
              <p class="truncate font-medium text-slate-900">{{ data.name }}</p>
              <p class="truncate text-sm text-slate-500">{{ data.email }}</p>
            </div>
          </div>
        </template>
      </Column>

      <Column field="course" header="Curso" sortable />

      <Column field="campus" header="Campus" sortable />

      <Column field="role" header="Perfil" sortable>
        <template #body="{ data }">
          <Tag :value="ROLE_META[data.role as UserRole].label" :severity="ROLE_META[data.role as UserRole].severity" />
        </template>
      </Column>

      <Column field="createdAt" header="Criado em" sortable>
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>

      <Column field="isVerified" header="Verificado" sortable class="text-center">
        <template #body="{ data }">
          <i
            v-if="data.isVerified"
            class="pi pi-check-circle text-green-600"
            aria-label="Verificado"
          />
          <i v-else class="pi pi-times-circle text-slate-400" aria-label="Não verificado" />
        </template>
      </Column>

      <Column header="Ações" class="w-20 text-center">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            aria-label="Excluir usuário"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
