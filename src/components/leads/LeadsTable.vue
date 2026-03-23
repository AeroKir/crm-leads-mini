<template>
  <v-card elevation="2">
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      v-model:sort-by="sortBy"
      class="elevation-0"
      :headers="headers"
      hover
      item-value="id"
      :items="filteredLeads"
      :items-per-page-options="[10, 20, 50]"
      :loading="isLoading"
      @click:row="onRowClick"
    >
      <template #item.fullName="{ item }">
        <div class="font-weight-medium">
          {{ item.fullName }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ item.email || '—' }}
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip size="small">
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.owner="{ item }">
        {{ item.owner }}
      </template>

      <template #item.source="{ item }">
        {{ item.source }}
      </template>

      <template #item.lastActivityAt="{ item }">
        {{ formatDate(item.lastActivityAt) }}
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.budget="{ item }">
        {{ formatBudget(item.budget) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
  import type { Lead } from '@/types/lead'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLeads } from '@/composables/useLeads'

  type SortItem = {
    key: string
    order?: 'asc' | 'desc'
  }

  const router = useRouter()

  const {
    filteredLeads,
    pagination,
    sort,
    isLoading,
  } = useLeads()

  const headers = [
    { title: 'Name', key: 'fullName', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Owner', key: 'owner', sortable: true },
    { title: 'Source', key: 'source', sortable: true },
    { title: 'Last activity', key: 'lastActivityAt', sortable: true },
    { title: 'Created at', key: 'createdAt', sortable: true },
    { title: 'Budget', key: 'budget', sortable: true },
  ]

  const page = computed({
    get: () => pagination.value.page,
    set: (value: number) => {
      pagination.value.page = value
    },
  })

  const itemsPerPage = computed({
    get: () => pagination.value.perPage,
    set: (value: number) => {
      pagination.value.perPage = value
      pagination.value.page = 1
    },
  })

  const sortBy = computed<SortItem[]>({
    get: () => [
      {
        key: sort.value.key,
        order: sort.value.order,
      },
    ],
    set: value => {
      const first = value[0]

      if (!first) {
        sort.value.key = 'lastActivityAt'
        sort.value.order = 'desc'
        return
      }

      sort.value.key = first.key
      sort.value.order = first.order || 'asc'
      pagination.value.page = 1
    },
  })

  function onRowClick (_: Event, row: { item: Lead }) {
    router.push(`/leads/${row.item.id}`)
  }

  function formatDate (value?: string) {
    if (!value) return '—'

    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value))
  }

  function formatBudget (value?: number) {
    if (value == null) return '—'

    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }
</script>
