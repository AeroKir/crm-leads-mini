<template>
  <div>
    <v-btn color="primary" @click="openDialog">
      Create lead
    </v-btn>

    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title>Create lead</v-card-title>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.fullName"
                  label="Full name"
                  :rules="[requiredRule]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Phone"
                  :rules="[requiredRule, phoneRule]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.source"
                  :items="sources"
                  label="Source"
                  :rules="[requiredRule]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.owner"
                  :items="owners"
                  label="Owner"
                  :rules="[requiredRule]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.budget"
                  label="Budget"
                  min="0"
                  type="number"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="tagsInput"
                  label="Tags (comma separated)"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="handleSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useCreateLeadDialog } from '@/composables/useCreateLeadDialog'

  const {
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
  } = useCreateLeadDialog()
</script>
