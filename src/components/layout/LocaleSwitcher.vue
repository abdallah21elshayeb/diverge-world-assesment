<template>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 p-2   dark:text-white"
      >
        <img :src="currentFlag" alt="Flag" class="w-6 h-6" />
        {{ availableLocales[selectedLocale] }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7">
          </path>
        </svg>
      </button>
  
      <div
        v-if="isOpen"
        class="absolute left-0 w-full mt-2 bg-white dark:text-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-md"
      >
        <button
          v-for="(label, key) in availableLocales"
          :key="key"
          @click="changeLocale(key)"
          class="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <img :src="flags[key]" alt="Flag" class="w-6 h-6" />
          {{ label }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  // Locale and dropdown state
  const { locale } = useI18n();
  const isOpen = ref(false);
  const selectedLocale = ref(locale.value);
  
  // Locale options with flags
  const availableLocales: Record<string, string> = {
    en: 'English',
    ar: 'العربية',
  };
  
  const flags: Record<string, string> = {
    en: '/images/country/country-01.svg',
    ar: '/images/country/country-02.svg',
  };
  
  // Get current flag
  const currentFlag = ref(flags[locale.value]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Change locale and update direction
  const changeLocale = (newLocale: string) => {
    selectedLocale.value = newLocale;
    locale.value = newLocale;
    currentFlag.value = flags[newLocale];
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
    isOpen.value = false; // Close dropdown
  };
  
  // Watch locale changes
  watchEffect(() => {
    selectedLocale.value = locale.value;
    currentFlag.value = flags[locale.value];
  });
  </script>
