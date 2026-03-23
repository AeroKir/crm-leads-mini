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
    notesByLeadId,
  } = storeToRefs(store)

  function resetFilters () {
    search.value = ''

    filters.value.statuses = []
    filters.value.owner = ''
    filters.value.source = ''
    filters.value.createdFrom = ''
    filters.value.createdTo = ''

    pagination.value.page = 1
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
    notesByLeadId,

    // actions
    loadLeads: store.loadLeads,
    getLeadById: store.getLeadById,
    getLeadNotes: store.getLeadNotes,
    updateLeadStatus: store.updateLeadStatus,
    updateManyLeadsStatus: store.updateManyLeadsStatus,
    addNote: store.addNote,
    createLead: store.createLead,
    resetFilters,
  }
}
