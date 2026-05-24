import { defineStore } from 'pinia';

export const useVantagensStore = defineStore('vantagens', {
  state: () => ({
    vantagens: [],
    loading: false,
    error: null,
    fetched: false
  }),
  actions: {
    async fetchVantagens() {
      if (this.fetched) return;
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=vantagens');
        if (!response.ok) throw new Error('Failed to fetch vantagens');
        this.vantagens = await response.json();
        this.fetched = true;
      } catch (error) {
        this.error = error;
        console.error('Error fetching vantagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
