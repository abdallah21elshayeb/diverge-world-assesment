import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiResponse } from '@/Interfaces/api'

export function useApi<T>() {
  const data: Ref<T | null> = ref(null)
  const error: Ref<string | null> = ref(null)
  const loading: Ref<boolean> = ref(false)

  const fetchData = async (url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      data.value = await response.json()
      return { data: data.value, error: null, loading: false }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return { data: null, error: error.value, loading: false }
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetchData,
  }
}
