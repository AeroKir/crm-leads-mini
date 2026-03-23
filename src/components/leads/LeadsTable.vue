<template>
  <v-card elevation="2">
    <div
      v-if="selectedIds.length > 0"
      class="d-flex align-center ga-3 pa-4 border-b"
    >
      <div class="text-body-2 font-weight-medium">
        Selected: {{ selectedIds.length }}
      </div>

      <v-select
        v-model="bulkStatus"
        density="compact"
        hide-details
        :items="statuses"
        label="Change status"
        style="max-width: 220px;"
      />

      <v-btn
        color="primary"
        :disabled="!bulkStatus"
        :loading="isLoading"
        @click="applyBulkStatus"
      >
        Apply
      </v-btn>

      <v-btn
        variant="text"
        @click="clearSelection"
      >
        Clear
      </v-btn>
    </div>

    <v-data-table
      v-model="selectedIds"
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
      must-sort
      show-select
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
  import type { Lead, LeadStatus } from '@/types/lead'
  import { computed, ref, watch } from 'vue'
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
    statuses,
    isLoading,
    updateManyLeadsStatus,
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

  const selectedIds = ref<string[]>([])
  const bulkStatus = ref<LeadStatus | null>(null)

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

  watch(
    filteredLeads,
    items => {
      const currentIds = new Set(items.map(item => item.id))
      selectedIds.value = selectedIds.value.filter(id => currentIds.has(id))
    },
    { deep: true },
  )

  async function applyBulkStatus () {
    if (!bulkStatus.value || selectedIds.value.length === 0) return

    await updateManyLeadsStatus(selectedIds.value, bulkStatus.value)

    bulkStatus.value = null
    selectedIds.value = []
  }

  function clearSelection () {
    selectedIds.value = []
    bulkStatus.value = null
  }

  function onRowClick (event: Event, row: { item: Lead }) {
    const target = event.target as HTMLElement | null

    if (target?.closest('.v-selection-control')) {
      return
    }

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
