import { defineStore } from 'pinia';

export const useVantagensStore = defineStore('vantagens', {
  state: () => ({
    vantagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchVantagens() {
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=vantagens');
        if (!response.ok) throw new Error('Failed to fetch vantagens');
        this.vantagens = await response.json();
      } catch (error) {
        this.error = error;
        console.error('Error fetching vantagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
