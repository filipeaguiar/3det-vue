import { defineStore } from 'pinia';

export const useTecnicasStore = defineStore('tecnicas', {
  state: () => ({
    tecnicas: [],
    loading: false,
    error: null,
    fetched: false
  }),
  actions: {
    async fetchTecnicas() {
      if (this.fetched) return;
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=tecnicas');
        if (!response.ok) throw new Error('Failed to fetch tecnicas');
        this.tecnicas = await response.json();
        this.fetched = true;
      } catch (error) {
        this.error = error;
        console.error('Error fetching tecnicas:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
