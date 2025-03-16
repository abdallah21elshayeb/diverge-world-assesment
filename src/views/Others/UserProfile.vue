<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="  p-5  lg:p-6"
    >
      <profile-card />
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
const currentPageTitle = ref('User Profile')
</script>
