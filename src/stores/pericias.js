import { defineStore } from 'pinia';

export const usePericiasStore = defineStore('pericias', {
  state: () => ({
    pericias: [],
    loading: false,
    error: null,
    fetched: false
  }),
  actions: {
    async fetchPericias() {
      if (this.fetched) return;
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=pericias');
        if (!response.ok) throw new Error('Failed to fetch pericias');
        this.pericias = await response.json();
        this.fetched = true;
      } catch (error) {
        this.error = error;
        console.error('Error fetching pericias:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
