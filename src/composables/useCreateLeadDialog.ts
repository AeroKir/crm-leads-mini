import type { Lead, LeadSource } from '@/types/lead'
import { ref } from 'vue'
import { useLeads } from '@/composables/useLeads'

type CreateLeadForm = {
  fullName: string
  phone: string
  email: string
  source: LeadSource | ''
  owner: string
  budget: number | null
}

function getDefaultForm (): CreateLeadForm {
  return {
    fullName: '',
    phone: '',
    email: '',
    source: '',
    owner: '',
    budget: null,
  }
}

export function useCreateLeadDialog () {
  const { createLead, owners, sources } = useLeads()

  const dialog = ref(false)
  const formRef = ref()
  const tagsInput = ref('')
  const form = ref<CreateLeadForm>(getDefaultForm())

  const requiredRule = (value: string) => !!value || 'Required'

  const phoneRule = (value: string) => {
    const normalized = value.replace(/[\s\-()+]/g, '')
    return /^\d{10,15}$/.test(normalized) || 'Phone must contain 10–15 digits'
  }

  async function handleSubmit () {
    const result = await formRef.value?.validate()

    if (!result?.valid) {
      return
    }

    const now = new Date().toISOString()

    const tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    const newLead: Lead = {
      id: crypto.randomUUID(),
      fullName: form.value.fullName.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim() || undefined,
      source: form.value.source as LeadSource,
      status: 'New',
      owner: form.value.owner,
      createdAt: now,
      lastActivityAt: now,
      budget: form.value.budget ?? undefined,
      tags,
    }

    createLead(newLead)
    closeDialog()
  }

  function openDialog () {
    dialog.value = true
  }

  function closeDialog () {
    dialog.value = false
    form.value = getDefaultForm()
    tagsInput.value = ''
    formRef.value?.resetValidation()
  }

  return {
    dialog,
    formRef,
    form,
    tagsInput,
    owners,
    sources,
    requiredRule,
    phoneRule,
    openDialog,
    closeDialog,
    handleSubmit,
  }
}
