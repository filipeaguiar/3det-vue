import { defineStore } from 'pinia';

export const useDesvantagensStore = defineStore('desvantagens', {
  state: () => ({
    desvantagens: [],
    loading: false,
    error: null,
    fetched: false
  }),
  actions: {
    async fetchDesvantagens() {
      if (this.fetched) return;
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=desvantagens');
        if (!response.ok) throw new Error('Failed to fetch desvantagens');
        this.desvantagens = await response.json();
        this.fetched = true;
      } catch (error) {
        this.error = error;
        console.error('Error fetching desvantagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
