import type { Lead, LeadNote, LeadStatus } from '@/types/lead'
import { defineStore } from 'pinia'
import leadsData from '@/data/leads.json'

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

      // 1. Search
      if (state.search) {
        const q = state.search.toLowerCase()
        result = result.filter(l =>
          l.fullName.toLowerCase().includes(q)
          || l.phone.includes(q)
          || l.email?.toLowerCase().includes(q),
        )
      }

      // 2. Filters
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

      // 3. Sort
      result.sort((a, b) => {
        const key = state.sort.key as keyof Lead
        const order = state.sort.order === 'asc' ? 1 : -1

        return a[key] > b[key] ? order : -order
      })

      return result
    },

    paginatedLeads (): Lead[] {
      if (!this.pagination) {
        return []
      }

      const start = (this.pagination.page - 1) * this.pagination.perPage
      return this.filteredLeads.slice(start, start + this.pagination.perPage)
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
      this.leads = leadsData as Lead[]
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

    async addNote (id: string, note: LeadNote) {
      this.isLoading = true

      await new Promise(r => setTimeout(r, 500))

      if (!this.notesByLeadId[id]) {
        this.notesByLeadId[id] = []
      }

      this.notesByLeadId[id].push(note)

      const lead = this.leads.find(l => l.id === id)
      if (lead) {
        lead.lastActivityAt = new Date().toISOString()
      }

      this.isLoading = false
    },
  },
})
