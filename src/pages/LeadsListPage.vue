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
  import LeadCreateDialog from '@/components/leads/LeadCreateDialog.vue'
  import LeadsFilters from '@/components/leads/LeadsFilters.vue'
  import LeadsTable from '@/components/leads/LeadsTable.vue'
  import { useLeadsListPage } from '@/composables/useLeadsListPage'

  const {
    onEditStatus,
    onAddNote,
  } = useLeadsListPage()
</script>
