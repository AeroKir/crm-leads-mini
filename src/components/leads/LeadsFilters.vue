<template>
  <v-card class="pa-4 mb-4" elevation="2">
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="localSearch"
          clearable
          label="Search (name, phone, email)"
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          v-model="filters.statuses"
          clearable
          :items="statuses"
          label="Status"
          multiple
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          v-model="filters.owner"
          clearable
          :items="owners"
          label="Owner"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          v-model="filters.source"
          clearable
          :items="sources"
          label="Source"
        />
      </v-col>

      <v-col cols="12" md="1">
        <v-text-field
          v-model="createdFrom"
          label="From"
          type="date"
        />
      </v-col>

      <v-col cols="12" md="1">
        <v-text-field
          v-model="createdTo"
          label="To"
          type="date"
        />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-btn
          color="primary"
          variant="text"
          @click="resetFilters"
        >
          Reset filters
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useDebounce } from '@/composables/useDebounce'
  import { useLeads } from '@/composables/useLeads'

  const {
    search,
    filters,
    owners,
    sources,
    statuses,
    resetFilters: resetLeadsFilters,
  } = useLeads()

  const localSearch = ref(search.value)
  const debouncedSearch = useDebounce(localSearch, 300)

  watch(debouncedSearch, val => {
    search.value = val
  })

  watch(search, val => {
    localSearch.value = val
  })

  const createdFrom = computed({
    get: () => filters.value.createdFrom,
    set: (val: string) => {
      filters.value.createdFrom = val || ''
    },
  })

  const createdTo = computed({
    get: () => filters.value.createdTo,
    set: (val: string) => {
      filters.value.createdTo = val || ''
    },
  })

  function resetFilters () {
    localSearch.value = ''
    resetLeadsFilters()
  }
</script>
