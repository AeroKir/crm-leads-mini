<template>
  <div class="pa-4">
    <h1>Leads</h1>

    <div>
      Filters here
    </div>

    <div>
      Table here
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useLeadsStore } from '@/stores/useLeadsStore'

  const store = useLeadsStore()

  onMounted(() => {
    store.loadLeads()
  })
</script>
