import type { Lead, LeadNote, LeadStatus } from '@/types/lead'
import { defineStore } from 'pinia'
import leadsData from '@/data/leads.json'

function compareValues (aValue: unknown, bValue: unknown, order: 1 | -1) {
  if (aValue == null && bValue == null) {
    return 0
  }
  if (aValue == null) {
    return 1
  }
  if (bValue == null) {
    return -1
  }

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return aValue.localeCompare(bValue) * order
  }

  if (aValue > bValue) {
    return 1 * order
  }
  if (aValue < bValue) {
    return -1 * order
  }

  return 0
}

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    leads: [] as Lead[],
    search: '',
    filters: {
      statuses: [] as LeadStatus[],
      owner: '',
      source: '',
      createdFrom: '',
      createdTo: '',
    },
    sort: {
      key: 'lastActivityAt',
      order: 'desc' as 'asc' | 'desc',
    },
    pagination: {
      page: 1,
      perPage: 10,
    },
    notesByLeadId: {} as Record<string, LeadNote[]>,
    isLoading: false,
  }),

  getters: {
    filteredLeads (state): Lead[] {
      let result = [...state.leads]

      if (state.search) {
        const q = state.search.toLowerCase()
        result = result.filter(l =>
          l.fullName.toLowerCase().includes(q)
          || l.phone.includes(q)
          || l.email?.toLowerCase().includes(q),
        )
      }

      if (state.filters.statuses.length > 0) {
        result = result.filter(l => state.filters.statuses.includes(l.status))
      }

      if (state.filters.owner) {
        result = result.filter(l => l.owner === state.filters.owner)
      }

      if (state.filters.source) {
        result = result.filter(l => l.source === state.filters.source)
      }

      if (state.filters.createdFrom) {
        result = result.filter(l => l.createdAt >= state.filters.createdFrom)
      }

      if (state.filters.createdTo) {
        result = result.filter(l => l.createdAt <= state.filters.createdTo)
      }

      result.sort((a, b) => {
        const key = state.sort.key as keyof Lead
        const order = state.sort.order === 'asc' ? 1 : -1

        return compareValues(a[key], b[key], order)
      })

      return result
    },

    total (): number {
      return this.filteredLeads.length
    },

    owners (state): string[] {
      return [...new Set(state.leads.map(l => l.owner))]
    },

    sources (state): string[] {
      return [...new Set(state.leads.map(l => l.source))]
    },

    statuses (): LeadStatus[] {
      return ['New', 'InProgress', 'Qualified', 'Won', 'Lost']
    },
  },

  actions: {
    loadLeads () {
      if (this.leads.length > 0) {
        return
      }

      this.leads = leadsData as Lead[]
    },

    createLead (lead: Lead) {
      this.leads.unshift(lead)

      if (!this.notesByLeadId[lead.id]) {
        this.notesByLeadId[lead.id] = []
      }
    },

    getLeadById (id: string) {
      return this.leads.find(lead => lead.id === id) || null
    },

    getLeadNotes (id: string) {
      return this.notesByLeadId[id] || []
    },

    async updateLeadStatus (id: string, status: LeadStatus) {
      this.isLoading = true

      await new Promise(r => setTimeout(r, 500))

      const lead = this.leads.find(l => l.id === id)
      if (lead) {
        lead.status = status
        lead.lastActivityAt = new Date().toISOString()
      }

      this.isLoading = false
    },

    async updateManyLeadsStatus (ids: string[], status: LeadStatus) {
      this.isLoading = true

      await new Promise(r => setTimeout(r, 500))

      const now = new Date().toISOString()

      this.leads = this.leads.map(lead => {
        if (!ids.includes(lead.id)) {
          return lead
        }

        return {
          ...lead,
          status,
          lastActivityAt: now,
        }
      })

      this.isLoading = false
    },

    async addNote (id: string, note: LeadNote) {
      this.isLoading = true

      await new Promise(r => setTimeout(r, 500))

      if (!this.notesByLeadId[id]) {
        this.notesByLeadId[id] = []
      }

      this.notesByLeadId[id].unshift(note)

      const lead = this.leads.find(l => l.id === id)
      if (lead) {
        lead.lastActivityAt = note.createdAt
      }

      this.isLoading = false
    },
  },
})
