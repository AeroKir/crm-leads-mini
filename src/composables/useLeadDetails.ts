import type { LeadNote, LeadStatus } from '@/types/lead'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeads } from '@/composables/useLeads'

export function useLeadDetails () {
  const route = useRoute()
  const router = useRouter()

  const {
    loadLeads,
    getLeadById,
    getLeadNotes,
    updateLeadStatus,
    addNote,
    statuses,
    isLoading,
  } = useLeads()

  const noteTypes = ['call', 'email', 'comment'] as const

  const localStatus = ref<LeadStatus>('New')
  const noteType = ref<'call' | 'email' | 'comment'>('comment')
  const noteText = ref('')
  const noteError = ref('')

  const leadId = computed(() => String(route.params.id))

  const lead = computed(() => {
    return getLeadById(leadId.value)
  })

  const notes = computed(() => {
    return getLeadNotes(leadId.value)
  })

  onMounted(() => {
    loadLeads()

    if (lead.value) {
      localStatus.value = lead.value.status
    }
  })

  watch(
    lead,
    value => {
      if (value) {
        localStatus.value = value.status
      }
    },
    { immediate: true },
  )

  watch(noteText, value => {
    if (value.trim()) {
      noteError.value = ''
    }
  })

  async function handleSaveStatus () {
    if (!lead.value) {
      return
    }
    if (localStatus.value === lead.value.status) {
      return
    }

    await updateLeadStatus(lead.value.id, localStatus.value)
  }

  async function handleAddNote () {
    if (!lead.value) {
      return
    }

    const trimmed = noteText.value.trim()

    if (!trimmed) {
      noteError.value = 'Note cannot be empty'
      return
    }

    noteError.value = ''

    const note: LeadNote = {
      id: crypto.randomUUID(),
      type: noteType.value,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }

    await addNote(lead.value.id, note)

    noteText.value = ''
    noteType.value = 'comment'
  }

  function goBack () {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/leads')
  }

  function formatDateTime (value?: string) {
    if (!value) {
      return '—'
    }

    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  }

  function formatBudget (value?: number) {
    if (value == null) {
      return '—'
    }

    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return {
    lead,
    notes,
    statuses,
    isLoading,
    noteTypes,
    localStatus,
    noteType,
    noteText,
    noteError,
    handleSaveStatus,
    handleAddNote,
    goBack,
    formatDateTime,
    formatBudget,
  }
}
