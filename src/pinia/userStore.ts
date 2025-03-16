import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import mockApi from '@/mockApi/mockApi';
import type { User } from '@/Interfaces/user';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const allUsers = computed(() => users.value);
  const getUser = computed(() => currentUser.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // Actions
  const fetchUsers = async (searchQuery: string = '') => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mockApi.getUsers({ search: searchQuery });
      users.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users';
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mockApi.getUser(id);
      currentUser.value = response.data || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user';
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mockApi.updateUser(id, data);
      currentUser.value = response.data || null;
      // Update the user in the users list
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...data };
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user';
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await mockApi.deleteUser(id);
      // Remove the user from the users list
      users.value = users.value.filter((user) => user.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user';
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    currentUser,
    loading,
    error,
    allUsers,
    getUser,
    isLoading,
    getError,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };
});