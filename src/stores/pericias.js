import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePericiasStore = defineStore('pericias', () => {
  const pericias = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPericias = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/rules/pericias');
      if (!response.ok) throw new Error('Failed to fetch pericias');
      pericias.value = await response.json();
    } catch (err) {
      error.value = err;
      console.error('Erro ao carregar perícias:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    pericias,
    loading,
    error,
    fetchPericias,
  };
});
