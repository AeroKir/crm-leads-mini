<template>
  <div class="pa-4">
    <div v-if="!lead">
      <h2>Lead not found</h2>
    </div>

    <div v-else>
      <h1>{{ lead.fullName }}</h1>
      <p>Status: {{ lead.status }}</p>
      <p>Owner: {{ lead.owner }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useLeadsStore } from '@/stores/useLeadsStore'

  const route = useRoute()
  const store = useLeadsStore()

  onMounted(() => {
    if (store.leads.length === 0) {
      store.loadLeads()
    }
  })

  const lead = computed(() =>
    store.leads.find(l => l.id === route.params.id),
  )
</script>
