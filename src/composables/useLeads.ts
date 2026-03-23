import { storeToRefs } from 'pinia'
import { useLeadsStore } from '@/stores/useLeadsStore'

export function useLeads () {
  const store = useLeadsStore()

  const {
    leads,
    search,
    filters,
    sort,
    pagination,
    isLoading,
    filteredLeads,
    total,
    owners,
    sources,
    statuses,
  } = storeToRefs(store)

  function resetFilters () {
    search.value = ''

    filters.value.statuses = []
    filters.value.owner = ''
    filters.value.source = ''
    filters.value.createdFrom = ''
    filters.value.createdTo = ''
  }

  return {
    // state
    leads,
    search,
    filters,
    sort,
    pagination,
    isLoading,

    // derived
    filteredLeads,
    total,
    owners,
    sources,
    statuses,

    // actions
    loadLeads: store.loadLeads,
    updateLeadStatus: store.updateLeadStatus,
    addNote: store.addNote,
    resetFilters,
  }
}
