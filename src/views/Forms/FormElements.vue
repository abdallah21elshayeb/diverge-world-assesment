<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t(currentPageTitle)" />
    <div class="grid grid-cols-1">
      <div class="space-y-6">
        <ComponentCard :title="$t('Add User')">
          <DefaultInputs />
        </ComponentCard>
      </div>  
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DefaultInputs from '@/components/forms/DefaultInputs.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
const currentPageTitle = ref('User Form')
</script>
