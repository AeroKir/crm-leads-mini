<template>
  <div class="pa-4">
    <h1>Leads</h1>

    <div>
      Total: {{ total }}
    </div>

    <div>
      <pre>{{ paginatedLeads }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useLeads } from '@/composables/useLeads'

  const {
    loadLeads,
    paginatedLeads,
    total,
  } = useLeads()

  onMounted(() => {
    loadLeads()
  })
</script>
