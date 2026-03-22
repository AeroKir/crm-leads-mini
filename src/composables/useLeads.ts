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
    paginatedLeads,
    total,
    owners,
    sources,
    statuses,
  } = storeToRefs(store)

  return {
    // state
    leads,
    search,
    filters,
    sort,
    pagination,
    isLoading,

    // derived
    paginatedLeads,
    total,
    owners,
    sources,
    statuses,

    // actions
    loadLeads: store.loadLeads,
    updateLeadStatus: store.updateLeadStatus,
    addNote: store.addNote,
  }
}
