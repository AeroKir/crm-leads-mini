<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">
      Leads
    </h1>

    <LeadsFilters />

    <LeadsTable
      @add-note="onAddNote"
      @edit-status="onEditStatus"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Lead } from '@/types/lead'
  import { onMounted, watch } from 'vue'
  import LeadsFilters from '@/components/leads/LeadsFilters.vue'
  import LeadsTable from '@/components/leads/LeadsTable.vue'
  import { useLeads } from '@/composables/useLeads'

  const {
    loadLeads,
    search,
    filters,
    pagination,
  } = useLeads()

  onMounted(() => {
    loadLeads()
  })

  watch(
    [search, filters],
    () => {
      pagination.value.page = 1
    },
    { deep: true },
  )

  function onEditStatus (lead: Lead) {
    console.log('Edit status', lead)
  }

  function onAddNote (lead: Lead) {
    console.log('Add note', lead)
  }
</script>
