<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <h2 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ session?.id ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
    <form @submit.prevent="submitForm" class="flex flex-col flex-grow overflow-y-auto custom-scrollbar pr-4">
      
      <!-- Campos Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Título e Descrição -->
      </div>

      <!-- Seções Dinâmicas -->
      <div class="space-y-6 mt-6">
        <!-- Objetivos -->
        <div class="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700">
          <h3 class="text-lg font-bold mb-3 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'bullseye']" /><span>Objetivos</span></h3>
          <div v-for="(item, index) in formData.objetivos" :key="item._tempId || index" class="space-y-2 mb-3 p-3 border rounded-lg bg-white dark:bg-slate-800">
            <textarea v-model="item.description" placeholder="Descrição do objetivo" class="w-full rounded-md dark:bg-slate-600"></textarea>
            <button @click="removeFormField('objetivos', index)">Remover</button>
          </div>
          <button @click="addFormField('objetivos', { description: '', completed: false })">Adicionar Objetivo</button>
        </div>

        <!-- NPCs Importantes -->
        <div class="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700">
          <h3 class="text-lg font-bold mb-3 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-friends']" /><span>NPCs Importantes</span></h3>
          <div v-for="(item, index) in formData.npcs_importantes" :key="item._tempId || index" class="space-y-2 mb-3 p-3 border rounded-lg bg-white dark:bg-slate-800">
            <select v-model="item.npc_id" class="w-full rounded-md dark:bg-slate-600">
              <option :value="null">Selecione um NPC</option>
              <option v-for="npc in npcsStore.npcs" :key="npc.id" :value="npc.id">{{ npc.name }}</option>
            </select>
            <textarea v-model="item.role" placeholder="Papel na sessão" class="w-full rounded-md dark:bg-slate-600"></textarea>
            <textarea v-model="item.notes" placeholder="Notas sobre o NPC" class="w-full rounded-md dark:bg-slate-600"></textarea>
            <button @click="removeFormField('npcs_importantes', index)">Remover</button>
          </div>
          <button @click="addFormField('npcs_importantes', { npc_id: null, role: '', notes: '' })">Adicionar NPC</button>
        </div>

        <!-- Outras seções... -->
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end space-x-2 mt-6">
        <button type="button" @click="$emit('creationCancelled')">Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  session: Object,
  campaignId: [String, Number],
});
const emit = defineEmits(['sessionUpdated', 'creationCancelled']);

const npcsStore = useNpcsStore();

const formData = ref({
  title: '',
  description: '',
  objetivos: [],
  npcs_importantes: [],
  // ... outros campos
});

const resetForm = () => {
  formData.value = {
    title: '', description: '', objetivos: [], npcs_importantes: [],
    // ... resetar outros campos
  };
};

watch(() => props.session, (newSession) => {
  if (newSession && Object.keys(newSession).length > 0) {
    formData.value = {
      ...formData.value,
      ...newSession,
      objetivos: (newSession.objetivos || []).map(o => ({ ...o, _tempId: uuidv4() })),
      npcs_importantes: (newSession.npcs_importantes || []).map(n => {
        const npcMatch = npcsStore.npcs.find(npc => npc.name === n.name);
        return { ...n, npc_id: npcMatch ? npcMatch.id : null, _tempId: uuidv4() };
      }),
      // ... mapear outros campos
    };
  } else {
    resetForm();
  }
}, { immediate: true, deep: true });

const addFormField = (field, template) => {
  formData.value[field].push({ ...template, _tempId: uuidv4() });
};
const removeFormField = (field, index) => {
  formData.value[field].splice(index, 1);
};

const submitForm = () => {
  const dataToSave = { ...formData.value, campaign_id: props.campaignId };
  // Remover _tempId antes de salvar
  emit('sessionUpdated', dataToSave);
};

onMounted(() => {
  if (props.campaignId) {
    npcsStore.fetchNpcs(props.campaignId);
  }
});

</script>
