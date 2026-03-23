<template>
  <div class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">
        Leads
      </h1>

      <LeadCreateDialog />
    </div>
    <LeadsFilters />

    <LeadsTable
      @add-note="onAddNote"
      @edit-status="onEditStatus"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Lead, LeadStatus } from '@/types/lead'
  import { watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import LeadCreateDialog from '@/components/leads/LeadCreateDialog.vue'
  import LeadsFilters from '@/components/leads/LeadsFilters.vue'
  import LeadsTable from '@/components/leads/LeadsTable.vue'
  import { useLeads } from '@/composables/useLeads'

  const router = useRouter()
  const route = useRoute()

  const {
    loadLeads,
    search,
    filters,
    sort,
    pagination,
  } = useLeads()

  const DEFAULT_SORT_KEY = 'lastActivityAt'
  const DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'desc'
  const DEFAULT_PER_PAGE = 10
  const ALLOWED_PER_PAGE = new Set([10, 20, 50])

  loadLeads()
  applyQueryToState()

  watch(
    [search, filters, sort, pagination],
    () => {
      syncStateToQuery()
    },
    { deep: true },
  )

  function applyQueryToState () {
    const q = route.query

    search.value = typeof q.search === 'string' ? q.search : ''

    filters.value.statuses
      = typeof q.status === 'string' && q.status.length > 0
        ? (q.status.split(',') as LeadStatus[])
        : []

    filters.value.owner = typeof q.owner === 'string' ? q.owner : ''
    filters.value.source = typeof q.source === 'string' ? q.source : ''
    filters.value.createdFrom = typeof q.createdFrom === 'string' ? q.createdFrom : ''
    filters.value.createdTo = typeof q.createdTo === 'string' ? q.createdTo : ''

    const parsedPage
      = typeof q.page === 'string' && !Number.isNaN(Number(q.page))
        ? Number(q.page)
        : 1

    pagination.value.page = Math.max(1, parsedPage)

    const parsedPerPage
      = typeof q.perPage === 'string' && !Number.isNaN(Number(q.perPage))
        ? Number(q.perPage)
        : DEFAULT_PER_PAGE

    pagination.value.perPage = ALLOWED_PER_PAGE.has(parsedPerPage)
      ? parsedPerPage
      : DEFAULT_PER_PAGE

    if (typeof q.sort === 'string' && q.sort.includes(':')) {
      const [key, order] = q.sort.split(':')

      sort.value.key = key || DEFAULT_SORT_KEY
      sort.value.order = order === 'asc' ? 'asc' : 'desc'
    } else {
      sort.value.key = DEFAULT_SORT_KEY
      sort.value.order = DEFAULT_SORT_ORDER
    }
  }

  function syncStateToQuery () {
    const query: Record<string, string> = {}

    if (search.value) {
      query.search = search.value
    }

    if (filters.value.statuses.length > 0) {
      query.status = filters.value.statuses.join(',')
    }

    if (filters.value.owner) {
      query.owner = filters.value.owner
    }

    if (filters.value.source) {
      query.source = filters.value.source
    }

    if (filters.value.createdFrom) {
      query.createdFrom = filters.value.createdFrom
    }

    if (filters.value.createdTo) {
      query.createdTo = filters.value.createdTo
    }

    if (pagination.value.page > 1) {
      query.page = String(pagination.value.page)
    }

    if (pagination.value.perPage !== DEFAULT_PER_PAGE) {
      query.perPage = String(pagination.value.perPage)
    }

    if (
      sort.value.key !== DEFAULT_SORT_KEY
      || sort.value.order !== DEFAULT_SORT_ORDER
    ) {
      query.sort = `${sort.value.key}:${sort.value.order}`
    }

    router.replace({ query })
  }

  function onEditStatus (lead: Lead) {
    console.log('Edit status', lead)
  }

  function onAddNote (lead: Lead) {
    console.log('Add note', lead)
  }
</script>
