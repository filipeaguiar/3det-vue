import { defineStore } from 'pinia';

export const useTecnicasStore = defineStore('tecnicas', {
  state: () => ({
    tecnicas: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTecnicas() {
      this.loading = true;
      try {
        const response = await fetch('/api/entities?type=tecnicas');
        if (!response.ok) throw new Error('Failed to fetch tecnicas');
        this.tecnicas = await response.json();
      } catch (error) {
        this.error = error;
        console.error('Error fetching tecnicas:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
