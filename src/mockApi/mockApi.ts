import { useApi } from '@/composables/useApi'
import type { User } from '@/Interfaces/user'

const BASE_URL = import.meta.env.VITE_BASE_URL

const mockApi = {
  // Fetch users with pagination, filtering, and sorting
  getUsers: async (params: { page?: number; limit?: number; search?: string }) => {
    const { page = 1, limit = 10, search = '' } = params
    const url = `${BASE_URL}?page=${page}&limit=${limit}&search=${search}`
    const { fetchData } = useApi<User[]>()
    return await fetchData(url)
  },

  // Fetch a single user by ID
  getUser: async (id: number) => {
    const url = `${BASE_URL}/${id}`
    const { fetchData } = useApi<User>()
    return await fetchData(url)
  },

  // Update a user by ID
  updateUser: async (id: number, data: Partial<User>) => {
    const url = `${BASE_URL}/${id}`
    const { fetchData } = useApi<User>()
    return await fetchData(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  // Delete a user by ID
  deleteUser: async (id: number) => {
    const url = `${BASE_URL}/${id}`
    const { fetchData } = useApi<{ success: boolean }>()
    return await fetchData(url, {
      method: 'DELETE',
    })
  },

  // Fetch available roles (mock data)
  getRoles: async () => {
    return ['Admin', 'Manager', 'Viewer']
  },
}

export default mockApi
