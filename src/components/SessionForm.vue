<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <h2 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ session?.id ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
    <form @submit.prevent="submitForm" class="flex flex-col flex-grow overflow-y-auto custom-scrollbar pr-4 -mr-4">
      
      <!-- Campos Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="title" class="block text-sm font-bold text-gray-700 dark:text-gray-300">Título</label>
          <input v-model="formData.title" type="text" id="title" required class="mt-1 block w-full rounded-md shadow-sm dark:bg-slate-700" />
        </div>
        <div>
          <label for="description" class="block text-sm font-bold text-gray-700 dark:text-gray-300">Descrição Curta</label>
          <input v-model="formData.description" type="text" id="description" class="mt-1 block w-full rounded-md shadow-sm dark:bg-slate-700" />
        </div>
        <div class="md:col-span-2">
          <label for="comeco_forte" class="block text-sm font-bold text-gray-700 dark:text-gray-300">Começo Forte (Cena de Abertura)</label>
          <textarea v-model="formData.comeco_forte" id="comeco_forte" rows="2" class="mt-1 block w-full rounded-md shadow-sm dark:bg-slate-700"></textarea>
        </div>
        <div class="md:col-span-2">
          <label for="gancho_proxima_aventura" class="block text-sm font-bold text-gray-700 dark:text-gray-300">Gancho para a Próxima Aventura</label>
          <textarea v-model="formData.gancho_proxima_aventura" id="gancho_proxima_aventura" rows="2" class="mt-1 block w-full rounded-md shadow-sm dark:bg-slate-700"></textarea>
        </div>
      </div>

      <!-- Seções Dinâmicas -->
      <div class="space-y-6 mt-6">
        
        <!-- Objetivos -->
        <SectionBuilder title="Objetivos" icon="bullseye" :items="formData.objetivos" @add="addFormField('objetivos', { description: '', completed: false })" @remove="removeFormField('objetivos', $event)">
          <template #item="{ item }">
            <textarea v-model="item.description" placeholder="Descrição do objetivo" class="w-full rounded-md dark:bg-slate-600"></textarea>
          </template>
        </SectionBuilder>

        <!-- Ganchos de Personagens -->
        <SectionBuilder title="Ganchos de Personagens" icon="user-tag" :items="formData.ganchos_personagens" @add="addFormField('ganchos_personagens', { personagem_id: null, description: '' })" @remove="removeFormField('ganchos_personagens', $event)">
          <template #item="{ item }">
            <select v-model="item.personagem_id" class="w-full rounded-md dark:bg-slate-600 mb-2">
              <option :value="null">Selecione um Personagem</option>
              <option v-for="char in personagensStore.personagens" :key="char.id" :value="char.id">{{ char.name }}</option>
            </select>
            <textarea v-model="item.description" placeholder="Descrição do gancho narrativo" class="w-full rounded-md dark:bg-slate-600"></textarea>
          </template>
        </SectionBuilder>

        <!-- Locais Interessantes -->
        <SectionBuilder title="Locais Interessantes" icon="map-marker-alt" :items="formData.locais_interessantes" @add="addFormField('locais_interessantes', { name: '', description: '', caracteristicas: [] })" @remove="removeFormField('locais_interessantes', $event)">
          <template #item="{ item: local, index: localIndex }">
            <input v-model="local.name" placeholder="Nome do Local" class="w-full rounded-md dark:bg-slate-600 mb-2 font-bold">
            <textarea v-model="local.description" placeholder="Descrição do Local" class="w-full rounded-md dark:bg-slate-600 mb-2"></textarea>
            <div class="pl-4 mt-2 border-l-2 border-slate-300 dark:border-slate-600 space-y-2">
              <h4 class="font-semibold text-sm">Características:</h4>
              <div v-for="(carac, caracIndex) in local.caracteristicas" :key="carac._tempId || caracIndex" class="flex items-center gap-2">
                <textarea v-model="carac.description" placeholder="Detalhe sensorial ou mecânico" class="w-full text-sm rounded-md dark:bg-slate-500"></textarea>
                <button @click="removeNestedField('locais_interessantes', localIndex, 'caracteristicas', caracIndex)" class="text-red-500 hover:text-red-700 text-xs">Remover</button>
              </div>
              <button @click="addNestedField('locais_interessantes', localIndex, 'caracteristicas', { description: '' })" class="text-xs text-amber-600">Adicionar Característica</button>
            </div>
          </template>
        </SectionBuilder>
        
        <!-- NPCs Importantes -->
        <SectionBuilder title="NPCs Importantes" icon="user-friends" :items="formData.npcs_importantes" @add="addFormField('npcs_importantes', { npc_id: null, role: '', notes: '' })" @remove="removeFormField('npcs_importantes', $event)">
          <template #item="{ item }">
            <select v-model="item.npc_id" class="w-full rounded-md dark:bg-slate-600 mb-2">
              <option :value="null">Selecione um NPC</option>
              <option v-for="npc in npcsStore.npcs" :key="npc.id" :value="npc.id">{{ npc.name }}</option>
            </select>
            <input v-model="item.role" placeholder="Papel na sessão" class="w-full rounded-md dark:bg-slate-600 mb-2">
            <textarea v-model="item.notes" placeholder="Notas sobre o NPC" class="w-full rounded-md dark:bg-slate-600"></textarea>
          </template>
        </SectionBuilder>

        <!-- Encontros e Desafios -->
        <SectionBuilder title="Encontros e Desafios" icon="dragon" :items="formData.encontros_desafios" @add="addFormField('encontros_desafios', { name: '', description: '', mecanica: '' })" @remove="removeFormField('encontros_desafios', $event)">
          <template #item="{ item }">
            <input v-model="item.name" placeholder="Nome do Encontro" class="w-full rounded-md dark:bg-slate-600 mb-2 font-bold">
            <textarea v-model="item.description" placeholder="Descrição do desafio" class="w-full rounded-md dark:bg-slate-600 mb-2"></textarea>
            <input v-model="item.mecanica" placeholder="Mecânica (Teste de H(2), etc)" class="w-full rounded-md dark:bg-slate-600">
          </template>
        </SectionBuilder>
        
        <!-- Segredos e Rumores -->
        <SectionBuilder title="Segredos e Rumores" icon="mask" :items="formData.segredos_rumores" @add="addFormField('segredos_rumores', { description: '', revealed: false })" @remove="removeFormField('segredos_rumores', $event)">
          <template #item="{ item }">
            <textarea v-model="item.description" placeholder="Descrição do segredo ou rumor" class="w-full rounded-md dark:bg-slate-600"></textarea>
          </template>
        </SectionBuilder>

        <!-- Tesouros e Recompensas -->
        <SectionBuilder title="Tesouros e Recompensas" icon="coins" :items="formData.tesouros_recompensas" @add="addFormField('tesouros_recompensas', { description: '', claimed: false })" @remove="removeFormField('tesouros_recompensas', $event)">
          <template #item="{ item }">
            <textarea v-model="item.description" placeholder="Descrição do tesouro ou recompensa" class="w-full rounded-md dark:bg-slate-600"></textarea>
          </template>
        </SectionBuilder>

      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end space-x-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" @click="$emit('creationCancelled')" class="px-4 py-2 rounded-md font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Cancelar</button>
        <button type="submit" class="px-6 py-2 rounded-md font-semibold text-white bg-amber-600 hover:bg-amber-700">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { usePersonagensStore } from '../stores/personagens';
import { v4 as uuidv4 } from 'uuid';
import SectionBuilder from './SectionBuilder.vue'; // Assumindo a criação deste componente

const props = defineProps({
  session: Object,
  campaignId: [String, Number],
});
const emit = defineEmits(['sessionUpdated', 'creationCancelled']);

const npcsStore = useNpcsStore();
const personagensStore = usePersonagensStore();

const initialFormState = () => ({
  title: '', description: '', comeco_forte: '', gancho_proxima_aventura: '',
  objetivos: [], ganchos_personagens: [], locais_interessantes: [], 
  npcs_importantes: [], encontros_desafios: [], segredos_rumores: [], tesouros_recompensas: [],
});

const formData = ref(initialFormState());

watch(() => props.session, (newSession) => {
  if (newSession && Object.keys(newSession).length > 0) {
    const sessionData = { ...newSession };
    // Normaliza todos os campos de array
    for (const key in initialFormState()) {
      if (Array.isArray(formData.value[key])) {
        sessionData[key] = (sessionData[key] || []).map(item => ({ ...item, _tempId: uuidv4() }));
      }
    }
    
    // Mapeia o nome do NPC para o ID correto
    if(sessionData.npcs_importantes) {
      sessionData.npcs_importantes = sessionData.npcs_importantes.map(n => {
        const npcMatch = npcsStore.npcs.find(npc => npc.name === n.name);
        return { ...n, npc_id: npcMatch ? npcMatch.id : null };
      });
    }

    formData.value = { ...initialFormState(), ...sessionData };
  } else {
    formData.value = initialFormState();
  }
}, { immediate: true, deep: true });

const addFormField = (field, template) => {
  if (!formData.value[field]) formData.value[field] = [];
  formData.value[field].push({ ...template, _tempId: uuidv4() });
};
const removeFormField = (field, index) => {
  formData.value[field].splice(index, 1);
};
const addNestedField = (parentField, parentIndex, childField, template) => {
  const parent = formData.value[parentField][parentIndex];
  if (!parent[childField]) parent[childField] = [];
  parent[childField].push({ ...template, _tempId: uuidv4() });
};
const removeNestedField = (parentField, parentIndex, childField, childIndex) => {
  formData.value[parentField][parentIndex][childField].splice(childIndex, 1);
};


const submitForm = () => {
  const dataToSave = JSON.parse(JSON.stringify(formData.value));
  for (const key in dataToSave) {
    if (Array.isArray(dataToSave[key])) {
      dataToSave[key].forEach(item => delete item._tempId);
    }
  }
  emit('sessionUpdated', { ...dataToSave, campaign_id: props.campaignId });
};

onMounted(() => {
  if (props.campaignId) {
    npcsStore.fetchNpcs(props.campaignId);
    personagensStore.fetchPersonagens(props.campaignId);
  }
});

watch(() => props.campaignId, (newId) => {
  if (newId) {
    npcsStore.fetchNpcs(newId);
    personagensStore.fetchPersonagens(newId);
  }
});
</script>
