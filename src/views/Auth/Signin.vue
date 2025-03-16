<template>
  <div class=" flex flex-col justify-center items-center h-screen">
    <h1>Login</h1>
    <div class="flex justify-center items-center gap-10 mt-10">

      <Button @click="login('admin')">Login as Admin</Button>
      <Button @click="login('manager')">Login as Manager</Button>
      <Button @click="login('viewer')">Login as Viewer</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const login = (role: string) => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userRole', role);
  router.push('/'); // Redirect to home page
};
</script>