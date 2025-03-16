<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ $t('User List') }}</h3>

      <div class="flex items-center gap-3">
        <select v-model="filterBy"
          class="border border-gray-300  bg-white px-6 py-2 rounded-lg dark:bg-gray-800 dark:text-white">
          <option value="name">{{ $t('Name') }}</option>
          <option value="role">{{ $t('Role') }}</option>
          <option value="status">{{ $t("Status") }}</option>
        </select>

        <input v-model="searchQuery" type="text" :placeholder="$t('Search') + '...'"
          class="border border-gray-300 px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white" />
        <Button size="md" variant="primary" @click="resetFilters"> {{ $t('Reset') }}
        </Button>


      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-t border-gray-100 dark:border-gray-800">
            <th class="py-3 text-left">#</th>
            <th class="py-3 text-left cursor-pointer" @click="toggleSort('name')">
              {{ $t('Name') }} <span>{{ sortBy === 'name' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '' }}</span>
            </th>
            <th class="py-3 text-left">{{ $t('Role') }}</th>
            <th class="py-3 text-left cursor-pointer" @click="toggleSort('date')">
              {{ $t('Join Date') }} <span>{{ sortBy === 'date' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '' }}</span>
            </th>
            <th class="py-3 text-left">{{ $t('Status') }}</th>
            <th class="py-3 text-left">{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="index"
            class="border-t border-gray-100 dark:border-gray-800">
            <td class="py-3 whitespace-nowrap dark:text-white/90">{{ index + 1 }}</td>
            <td class="py-3 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <img :src="user.img" :alt="user.name" class="h-[50px] w-[50px] rounded-md" />
                <p class="font-medium text-gray-800 dark:text-white/90">{{ user.name }}</p>
              </div>
            </td>
            <td class="py-3 whitespace-nowrap dark:text-white/90">{{ user.role }}</td>
            <td class="py-3 whitespace-nowrap dark:text-white/90">{{ formattedDate(user.date) }}</td>
            <td class="py-3 whitespace-nowrap dark:text-white/90">
              <span :class="statusClass(user.status)" class="rounded-full px-2 py-0.5 text-theme-xs font-medium">
                {{ user.status }}
              </span>
            </td>
            <td class="py-3 flex gap-2">
              <button @click="editUser(user.id)" class="text-blue-500 hover:text-blue-700">
                ✏️
              </button>
              <button @click="confirmDelete(user)" class="text-red-500 hover:text-red-700">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center gap-2 mt-4">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 dark:text-white">
        {{ $t('Prev') }}
      </button>
      <span class="text-gray-800 mt-1 dark:text-white/90">{{ $t('Page') }} {{ currentPage }} {{ $t('of') }} {{
        totalPages
        }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 dark:text-white">
        {{ $t('Next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from '@/components/ui/Button.vue'
import { usersData } from "@/data/userData";
import type { User } from "@/Interfaces/user";
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref(usersData)
const searchQuery = ref<string>("");
const filterBy = ref<string>("name");
const currentPage = ref<number>(1);
const usersPerPage = 7;
const sortBy = ref<string>("name"); // Default sorting field
const sortOrder = ref<"asc" | "desc">("asc"); // Default sorting order
const editingUser = ref<User | null>(null);
const userToDelete = ref<User | null>(null);

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    let valA = a[sortBy.value as keyof User];
    let valB = b[sortBy.value as keyof User];

    if (sortBy.value === "date") {
      // Convert date values to timestamps for proper numeric comparison
      const timeA = new Date(valA as string | Date).getTime();
      const timeB = new Date(valB as string | Date).getTime();
      return sortOrder.value === "asc" ? timeA - timeB : timeB - timeA;
    }

    // Convert other values to lowercase strings for comparison
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    if (strA < strB) return sortOrder.value === "asc" ? -1 : 1;
    if (strA > strB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});


// Computed filtered data
const filteredUsers = computed(() => {
  if (!searchQuery.value || !filterBy.value) return users.value;

  return users.value.filter((user) =>
    String(user[filterBy.value as keyof typeof user]) // Ensures TypeScript recognizes the key
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

const formattedDate = (date: string | Date): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(parsedDate);
};

// Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage;
  return sortedUsers.value.slice(start, start + usersPerPage);
});
const toggleSort = (field: "name" | "date") => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc"; // Reset to ascending order on new field
  }
};
// Total pages
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage));

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = "";
  filterBy.value = "name";
  currentPage.value = 1;
};

const editUser = (userId: number) => {
  router.push(`/users/${userId}/edit`); // Redirect to the edit page
};
const saveUser = () => {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.name === editingUser.value?.name);
    if (index !== -1) users.value[index] = editingUser.value;
    editingUser.value = null;
  }
};
const confirmDelete = (user: User) => userToDelete.value = user;
const deleteUser = () => {
  users.value = users.value.filter(user => user !== userToDelete.value);
  userToDelete.value = null;
};
// Status color classes
const statusClass = (status: string) => {
  return {
    "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-500": status === "Active",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400": status === "Pending",
    "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-500": status === "Inactive",
    "bg-gray-500 text-white dark:bg-white/5 dark:text-white": status === "Banned",
  };
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 5px;
}
</style>
