<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="$t(currentPageTitle)" />
        <div class="grid grid-cols-1">
            <div class="space-y-6">
                <ComponentCard :title="$t('Add User')">
                    <DefaultInputs  v-if="user" :formData="user" submitButtonTitle="Save Changes" :isEditMode="true"
                        @submit="handleFormSubmit" />
                        <p v-else>Loading user data...</p>
                </ComponentCard>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref,onMounted  } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DefaultInputs from '@/components/tables/userTable.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import type { User } from '@/Interfaces/user'
import { useRoute, useRouter } from 'vue-router';
import mockApi from '@/mockApi/mockApi'
const route = useRoute();
const router = useRouter();
const currentPageTitle = ref('User Edit Form')
const userId = route.params.id as string; 
const user = ref<User | null>(null);

// Function to handle edit icon click
onMounted(async () => {
  try {
    const userIdNumber = parseInt(userId, 10);
    const response = await mockApi.getUser(userIdNumber);
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});

// Handle form submission
const handleFormSubmit = async (data: User) => {
  try {
    const userIdNumber = parseInt(userId, 10);
    await mockApi.updateUser(userIdNumber, data); // Update the user data
    router.push('/'); // Redirect back to the user list
  } catch (error) {
    console.error('Failed to update user:', error);
  }
};
</script>