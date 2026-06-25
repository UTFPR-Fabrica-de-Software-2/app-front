<script setup lang="ts">
defineOptions({ name: 'PrivateAds' })

import { computed, ref } from 'vue'

import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataView from 'primevue/dataview'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import ConfirmDialog from 'primevue/confirmdialog'

type AdStatus = 'ACTIVE' | 'INACTIVE'
type AdCondition = 'NEW' | 'USED'
type AdType = 'PRODUCT' | 'SERVICE'
type AdCategory = 'FOOD' | 'ELECTRONICS' | 'BOOKS' | 'CLOTHING' | 'SERVICES' | 'OTHERS'

interface AdSeller {
  id: string
  name: string
  email: string
}

interface AdListItem {
  id: string
  title: string
  description?: string
  price: number
  category: AdCategory
  condition: AdCondition
  type: AdType
  status: AdStatus
  seller: AdSeller
  viewsCount: number
  location?: string
  createdAt: string
  images: string[]
}

const toast = useToast()
const confirm = useConfirm()

const STATUS_META: Record<AdStatus, { label: string; severity: 'success' | 'secondary' }> = {
  ACTIVE: { label: 'Ativo', severity: 'success' },
  INACTIVE: { label: 'Inativo', severity: 'secondary' },
}

const CATEGORY_META: Record<AdCategory, string> = {
  FOOD: 'Alimentação',
  ELECTRONICS: 'Eletrônicos',
  BOOKS: 'Livros',
  CLOTHING: 'Vestuário',
  SERVICES: 'Serviços',
  OTHERS: 'Outros',
}

const CONDITION_META: Record<AdCondition, string> = {
  NEW: 'Novo',
  USED: 'Usado',
}

const TYPE_META: Record<AdType, string> = {
  PRODUCT: 'Produto',
  SERVICE: 'Serviço',
}

// TODO: substituir pelos dados vindos do endpoint do back-end.
const ads = ref<AdListItem[]>([
  {
    id: '001',
    title: 'Salada de rabanete',
    description: 'Salada fresca de rabanete colhida no dia, ideal para um almoço leve no campus.',
    price: 12,
    category: 'FOOD',
    condition: 'NEW',
    type: 'PRODUCT',
    status: 'ACTIVE',
    seller: { id: 'u1', name: 'Paula Almeida', email: 'paula.almeida@utfpr.edu.br' },
    viewsCount: 134,
    location: 'Em frente ao Restaurante Universitário',
    createdAt: '2026-03-10T10:00:00Z',
    images: ['https://picsum.photos/seed/rabanete/600/600'],
  },
  {
    id: '002',
    title: 'Calculadora HP 50g',
    description: 'Calculadora gráfica em ótimo estado, perfeita para os cálculos da engenharia.',
    price: 350,
    category: 'ELECTRONICS',
    condition: 'USED',
    type: 'PRODUCT',
    status: 'ACTIVE',
    seller: { id: 'u2', name: 'Lucas Ferreira', email: 'lucas.ferreira@alunos.utfpr.edu.br' },
    viewsCount: 87,
    location: 'Bloco K - Sala 12',
    createdAt: '2026-02-22T10:00:00Z',
    images: ['https://picsum.photos/seed/calculadora/600/600'],
  },
  {
    id: '003',
    title: 'Aulas particulares de Cálculo',
    description: 'Reforço de Cálculo 1 e 2 com material próprio. Aulas presenciais ou online.',
    price: 60,
    category: 'SERVICES',
    condition: 'NEW',
    type: 'SERVICE',
    status: 'ACTIVE',
    seller: { id: 'u3', name: 'Patricia Souza', email: 'patricia.souza@utfpr.edu.br' },
    viewsCount: 212,
    location: 'Online',
    createdAt: '2025-11-11T10:00:00Z',
    images: ['https://picsum.photos/seed/aulas/600/600'],
  },
  {
    id: '004',
    title: 'Coleção de livros de Algoritmos',
    price: 180,
    category: 'BOOKS',
    condition: 'USED',
    type: 'PRODUCT',
    status: 'INACTIVE',
    seller: { id: 'u4', name: 'Kevin Oliveira', email: 'kevin.oliveira@alunos.utfpr.edu.br' },
    viewsCount: 45,
    createdAt: '2025-07-17T10:00:00Z',
    images: ['https://picsum.photos/seed/livros/600/600'],
  },
  {
    id: '005',
    title: 'Jaqueta da Atlética',
    description: 'Jaqueta oficial da atlética, tamanho M, usada poucas vezes.',
    price: 120,
    category: 'CLOTHING',
    condition: 'USED',
    type: 'PRODUCT',
    status: 'ACTIVE',
    seller: { id: 'u5', name: 'Amanda Lima', email: 'amanda.lima@alunos.utfpr.edu.br' },
    viewsCount: 98,
    location: 'Bloco da Atlética',
    createdAt: '2026-01-05T10:00:00Z',
    images: ['https://picsum.photos/seed/jaqueta/600/600'],
  },
  {
    id: '006',
    title: 'Marmitas fitness sob encomenda',
    description: 'Marmitas balanceadas preparadas semanalmente. Encomende seu combo.',
    price: 22,
    category: 'FOOD',
    condition: 'NEW',
    type: 'SERVICE',
    status: 'ACTIVE',
    seller: { id: 'u6', name: 'Paulo Mendes', email: 'paulo.mendes@utfpr.edu.br' },
    viewsCount: 320,
    location: 'Entrega no campus',
    createdAt: '2025-09-30T10:00:00Z',
    images: ['https://picsum.photos/seed/marmita/600/600'],
  },
])

const search = ref('')
const statusFilter = ref<AdStatus | null>(null)
const categoryFilter = ref<AdCategory | null>(null)

const statusOptions = (Object.keys(STATUS_META) as AdStatus[]).map((value) => ({
  value,
  label: STATUS_META[value].label,
}))
const categoryOptions = (Object.keys(CATEGORY_META) as AdCategory[]).map((value) => ({
  value,
  label: CATEGORY_META[value],
}))

const filteredAds = computed(() => {
  const term = search.value.trim().toLowerCase()

  return ads.value.filter((ad) => {
    const matchesTerm =
      !term ||
      ad.title.toLowerCase().includes(term) ||
      (ad.description?.toLowerCase().includes(term) ?? false) ||
      (ad.location?.toLowerCase().includes(term) ?? false) ||
      ad.seller.name.toLowerCase().includes(term)
    const matchesStatus = !statusFilter.value || ad.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || ad.category === categoryFilter.value

    return matchesTerm && matchesStatus && matchesCategory
  })
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

function coverImage(ad: AdListItem): string | undefined {
  return ad.images[0]
}

const selectedAd = ref<AdListItem | null>(null)
const detailsVisible = ref(false)

function openDetails(ad: AdListItem): void {
  selectedAd.value = ad
  detailsVisible.value = true
}

function confirmDelete(ad: AdListItem, event?: Event): void {
  event?.stopPropagation()
  confirm.require({
    header: 'Excluir anúncio',
    message: `Tem certeza que deseja excluir "${ad.title}"? Esta ação não poderá ser desfeita.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Excluir', severity: 'danger' },
    accept: () => deleteAd(ad),
  })
}

function deleteAd(ad: AdListItem): void {
  // TODO: chamar o endpoint de exclusão do back-end.
  ads.value = ads.value.filter((item) => item.id !== ad.id)
  if (selectedAd.value?.id === ad.id) detailsVisible.value = false
  toast.add({
    severity: 'success',
    summary: 'Anúncio excluído',
    detail: `"${ad.title}" foi removido com sucesso.`,
    life: 3000,
  })
}
</script>

<template>
  <section class="space-y-4">
    <header class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-slate-900">Anúncios</h1>
      <p class="text-sm text-slate-500">
        Visualize, pesquise e gerencie os anúncios cadastrados no sistema.
      </p>
    </header>

    <ConfirmDialog />

    <div
      class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <IconField class="w-full sm:flex-1">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" placeholder="Pesquise aqui" class="w-full" />
      </IconField>

      <Select
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Todos os estatus"
        show-clear
        class="w-full sm:w-56"
      />

      <Select
        v-model="categoryFilter"
        :options="categoryOptions"
        option-label="label"
        option-value="value"
        placeholder="Todas as categorias"
        show-clear
        class="w-full sm:w-56"
      />
    </div>

    <DataView :value="filteredAds" data-key="id" paginator :rows="9" layout="grid">
      <template #empty>
        <div class="py-12 text-center text-slate-500">Nenhum anúncio encontrado.</div>
      </template>

      <template #grid="{ items }">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="ad in (items as AdListItem[])"
            :key="ad.id"
            role="button"
            tabindex="0"
            class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
            @click="openDetails(ad)"
            @keydown.enter="openDetails(ad)"
            @keydown.space.prevent="openDetails(ad)"
          >
            <div class="relative h-40 overflow-hidden bg-slate-100">
              <img
                v-if="coverImage(ad)"
                :src="coverImage(ad)"
                :alt="ad.title"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                <i class="pi pi-image text-3xl" />
              </div>

              <Tag
                :value="STATUS_META[ad.status].label"
                :severity="STATUS_META[ad.status].severity"
                class="absolute left-3 top-3"
              />
            </div>

            <div class="flex flex-1 flex-col gap-1 p-4">
              <h2 class="truncate font-semibold text-slate-900">{{ ad.title }}</h2>
              <p class="font-semibold text-slate-700">{{ formatPrice(ad.price) }}</p>

              <p v-if="ad.location" class="mt-1 line-clamp-2 text-sm text-slate-500">
                <i class="pi pi-map-marker mr-1 text-xs" />{{ ad.location }}
              </p>

              <div class="mt-auto flex items-center justify-between pt-3">
                <span class="text-xs text-slate-400">
                  <i class="pi pi-eye mr-1" />{{ ad.viewsCount }}
                </span>
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  aria-label="Excluir anúncio"
                  @click="confirmDelete(ad, $event)"
                />
              </div>
            </div>
          </article>
        </div>
      </template>
    </DataView>

    <Dialog
      v-model:visible="detailsVisible"
      modal
      dismissable-mask
      :header="selectedAd?.title"
      class="w-full max-w-2xl"
    >
      <div v-if="selectedAd" class="flex flex-col gap-4">
        <div class="overflow-hidden rounded-xl bg-slate-100">
          <img
            v-if="coverImage(selectedAd)"
            :src="coverImage(selectedAd)"
            :alt="selectedAd.title"
            class="max-h-72 w-full object-cover"
          />
          <div v-else class="flex h-48 w-full items-center justify-center text-slate-300">
            <i class="pi pi-image text-5xl" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Tag
            :value="STATUS_META[selectedAd.status].label"
            :severity="STATUS_META[selectedAd.status].severity"
          />
          <Tag :value="CATEGORY_META[selectedAd.category]" severity="info" />
          <Tag :value="TYPE_META[selectedAd.type]" severity="secondary" />
          <Tag :value="CONDITION_META[selectedAd.condition]" severity="secondary" />
        </div>

        <p class="text-2xl font-semibold text-slate-900">{{ formatPrice(selectedAd.price) }}</p>

        <p v-if="selectedAd.description" class="text-slate-600">{{ selectedAd.description }}</p>
        <p v-else class="text-slate-400 italic">Sem descrição.</p>

        <Divider />

        <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-slate-500">Código</dt>
            <dd class="font-medium text-slate-900">{{ selectedAd.id }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Visualizações</dt>
            <dd class="font-medium text-slate-900">{{ selectedAd.viewsCount }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Anunciante</dt>
            <dd class="font-medium text-slate-900">
              {{ selectedAd.seller.name }}
              <span class="block text-xs font-normal text-slate-500">
                {{ selectedAd.seller.email }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">Localização</dt>
            <dd class="font-medium text-slate-900">{{ selectedAd.location ?? 'Não informada' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Criado em</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(selectedAd.createdAt) }}</dd>
          </div>
        </dl>
      </div>

      <template #footer>
        <Button label="Fechar" severity="secondary" outlined @click="detailsVisible = false" />
        <Button
          v-if="selectedAd"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          @click="confirmDelete(selectedAd)"
        />
      </template>
    </Dialog>
  </section>
</template>
