<template>
  <div class="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-transform duration-300 transform scale-100">
      <h2 class="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-500 flex items-center gap-x-2">
        <font-awesome-icon :icon="['fas', 'book-open']" class="text-amber-500" />
        <span>{{ isEditing ? 'Editar Campanha' : 'Nova Campanha' }}</span>
      </h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label for="name" class="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Nome da Campanha:</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            class="w-full py-2.5 px-3.5 text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl leading-tight transition-all duration-300 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Ex: As Crônicas de Arton"
            required
          >
          <p v-if="validationErrors.name" class="text-red-500 text-xs italic mt-1.5">{{ validationErrors.name }}</p>
        </div>
        
        <div class="mb-6">
          <label for="description" class="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Descrição:</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            class="w-full py-2.5 px-3.5 text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl leading-tight transition-all duration-300 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 placeholder-slate-400 dark:placeholder-slate-500" 
            rows="4"
            placeholder="Breve resumo da história, sistema ou tom da campanha..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-slate-500/15"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg font-bold transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-amber-500/20"
          >
            {{ isEditing ? 'Salvar Alterações' : 'Criar Campanha' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  campaign: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  description: '',
});

const validationErrors = ref({});

watch(() => props.campaign, (newVal) => {
  if (newVal) {
    isEditing.value = true;
    Object.assign(form.value, newVal);
  } else {
    isEditing.value = false;
    resetForm();
  }
}, { immediate: true });

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    description: '',
  };
  validationErrors.value = {};
};

const validateForm = () => {
  validationErrors.value = {};
  if (!form.value.name) {
    validationErrors.value.name = 'Nome da campanha é obrigatório.';
  }
  return Object.keys(validationErrors.value).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', form.value);
  }
};
</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
