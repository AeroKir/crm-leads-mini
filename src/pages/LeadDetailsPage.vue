<template>
  <div class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">
        Lead details
      </h1>

      <v-btn
        variant="text"
        @click="goBack"
      >
        Back to leads
      </v-btn>
    </div>

    <v-alert
      v-if="!lead"
      type="warning"
      variant="tonal"
    >
      Lead not found
    </v-alert>

    <template v-else>
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4" elevation="2">
            <v-card-title>
              {{ lead.fullName }}
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Phone
                  </div>
                  <div>{{ lead.phone }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Email
                  </div>
                  <div>{{ lead.email || '—' }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Owner
                  </div>
                  <div>{{ lead.owner }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Source
                  </div>
                  <div>{{ lead.source }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Created at
                  </div>
                  <div>{{ formatDateTime(lead.createdAt) }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Last activity
                  </div>
                  <div>{{ formatDateTime(lead.lastActivityAt) }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Budget
                  </div>
                  <div>{{ formatBudget(lead.budget) }}</div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    Current status
                  </div>
                  <div>
                    <v-chip size="small">
                      {{ lead.status }}
                    </v-chip>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-2">
                    Tags
                  </div>

                  <div class="d-flex flex-wrap ga-2">
                    <v-chip
                      v-for="tag in lead.tags"
                      :key="tag"
                      size="small"
                      variant="outlined"
                    >
                      {{ tag }}
                    </v-chip>

                    <span v-if="lead.tags.length === 0">—</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="2">
            <v-card-title>
              Activity / Notes
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleAddNote">
                <v-row>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="noteType"
                      :items="noteTypes"
                      label="Type"
                    />
                  </v-col>

                  <v-col cols="12" md="9">
                    <v-textarea
                      v-model="noteText"
                      auto-grow
                      :error-messages="noteError ? [noteError] : []"
                      label="New note"
                      rows="3"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      :loading="isLoading"
                      type="submit"
                    >
                      Add note
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-divider class="my-4" />

              <div v-if="notes.length === 0" class="text-medium-emphasis">
                No notes yet
              </div>

              <v-timeline
                v-else
                density="compact"
                side="end"
              >
                <v-timeline-item
                  v-for="note in notes"
                  :key="note.id"
                  dot-color="primary"
                  size="small"
                >
                  <template #opposite>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatDateTime(note.createdAt) }}
                    </div>
                  </template>

                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="d-flex align-center justify-space-between mb-2">
                        <strong>{{ note.type }}</strong>
                      </div>

                      <div>{{ note.text }}</div>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="2">
            <v-card-title>
              Change status
            </v-card-title>

            <v-card-text>
              <v-select
                v-model="localStatus"
                class="mb-4"
                :items="statuses"
                label="Status"
              />

              <v-btn
                block
                color="primary"
                :loading="isLoading"
                @click="handleSaveStatus"
              >
                Save
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { LeadNote, LeadStatus } from '@/types/lead'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLeads } from '@/composables/useLeads'

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

  onMounted(() => {
    loadLeads()

    if (lead.value) {
      localStatus.value = lead.value.status
    }
  })

  const leadId = computed(() => String(route.params.id))

  const lead = computed(() => {
    return getLeadById(leadId.value)
  })

  const notes = computed(() => {
    return getLeadNotes(leadId.value)
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

  async function handleSaveStatus () {
    if (!lead.value) return
    if (localStatus.value === lead.value.status) return

    await updateLeadStatus(lead.value.id, localStatus.value)
  }

  async function handleAddNote () {
    if (!lead.value) return

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
    if (!value) return '—'

    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  }

  function formatBudget (value?: number) {
    if (value == null) return '—'

    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }
</script>
