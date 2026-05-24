<template>
  <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px]">
    <!-- ESTADO DE CARREGAMENTO -->
    <div v-if="loading" class="text-center text-slate-500 dark:text-slate-400 flex items-center justify-center h-full">
      <p class="text-lg">Carregando Sessões...</p>
    </div>

    <!-- FORMULÁRIO DE EDIÇÃO/CRIAÇÃO -->
    <div v-else-if="isEditMode">
      <SessionForm :session="selectedSession" @save="saveSession" @close="cancelForm" />
    </div>

    <!-- VISUALIZAÇÃO DE DETALHES DA SESSÃO -->
    <div v-else-if="selectedSession" class="h-full flex flex-col">
      <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-2">{{ selectedSession.title }}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        <span v-if="selectedSession.campaign_id">Campanha: {{ selectedCampaignName }} • </span>
        Criada em: {{ formatDate(selectedSession.created_at) }}
      </p>

      <div class="grid grid-cols-1 gap-4 flex-grow overflow-y-auto">
        <!-- Descrição -->
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
              :icon="['fas', 'book-open']" class="text-slate-500" /><span>Descrição</span></h4>
          <p class="text-slate-600 dark:text-slate-400">{{ selectedSession.description || 'Nenhuma descrição.' }}</p>
        </div>

        <!-- Começo Forte -->
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
              :icon="['fas', 'bolt']" class="text-slate-500" /><span>Começo Forte</span></h4>
          <p class="text-slate-600 dark:text-slate-400">
            {{ selectedSession.comeco_forte || 'Nenhum começo forte definido' }}
          </p>
        </div>

        <!-- Gancho Próxima Aventura -->
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
              :icon="['fas', 'arrow-right']" class="text-slate-500" /><span>Gancho Próxima Aventura</span></h4>
          <p class="text-slate-600 dark:text-slate-400">
            {{ selectedSession.gancho_proxima_aventura || 'Nenhum gancho definido.' }}
          </p>
        </div>

        <!-- Seções de detalhes relacionados (sub-tabelas) -->
        <div class="grid grid-cols-1 gap-4">
          <h3 class="text-xl font-bold text-amber-700 dark:text-amber-500 mb-3">Detalhes da Sessão</h3>

          <!-- Ganchos de Personagens -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'user-tag']" class="text-slate-500" /><span>Ganchos de Personagens</span></h4>
            <ul v-if="sessionGanchosPersonagens.length">
              <li v-for="gancho in sessionGanchosPersonagens" :key="gancho.id"
                class="text-slate-600 dark:text-slate-400 mb-1">
                <span class="font-semibold">{{ gancho.personagem_name || 'Geral' }}:</span> {{ gancho.description }}
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum gancho de personagem.</p>
          </div>

          <!-- Locais Interessantes -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'map-marker-alt']" class="text-slate-500" /><span>Locais Interessantes</span></h4>
            <ul v-if="sessionLocaisInteressantes.length">
              <li v-for="local in sessionLocaisInteressantes" :key="local.id"
                class="text-slate-600 dark:text-slate-400 mb-1">
                <span class="font-semibold">{{ local.name }}</span>
                <ul v-if="local.caracteristicas && local.caracteristicas.length" class="ml-4 list-disc list-inside">
                  <li v-for="carac in local.caracteristicas" :key="carac.id">{{ carac.description }}</li>
                </ul>
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum local interessante.</p>
          </div>

          <!-- NPCs Importantes -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'user-friends']" class="text-slate-500" /><span>NPCs Importantes</span></h4>
            <ul v-if="sessionNpcsImportantes.length">
              <li v-for="npc in sessionNpcsImportantes" :key="npc.id" class="text-slate-600 dark:text-slate-400">{{
                npc.name }}</li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum NPC importante.</p>
          </div>

          <!-- Objetivos -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'bullseye']" class="text-slate-500" /><span>Objetivos</span></h4>
            <ul v-if="sessionObjetivos.length">
              <li v-for="obj in sessionObjetivos" :key="obj.id" class="text-slate-600 dark:text-slate-400">
                <span class="font-semibold">{{ obj.type }}:</span> {{ obj.description }}
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum objetivo.</p>
          </div>

          <!-- Segredos e Rumores -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'mask']" class="text-slate-500" /><span>Segredos e Rumores</span></h4>
            <ul v-if="sessionSegredosRumores.length">
              <li v-for="sr in sessionSegredosRumores" :key="sr.id" class="text-slate-600 dark:text-slate-400">{{
                sr.description }}</li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum segredo ou rumor.</p>
          </div>

          <!-- Tesouros e Recompensas -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'coins']" class="text-slate-500" /><span>Tesouros e Recompensas</span></h4>
            <ul v-if="sessionTesourosRecompensas.length">
              <li v-for="tr in sessionTesourosRecompensas" :key="tr.id" class="text-slate-600 dark:text-slate-400">
                <span class="font-semibold">{{ tr.name }}:</span>
                {{ tr.description_mecanica || 'Sem descrição mecânica.' }}
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum tesouro ou recompensa.</p>
          </div>

          <!-- Encontros e Desafios -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'dragon']" class="text-slate-500" /><span>Encontros e Desafios</span></h4>
            <ul v-if="sessionEncontrosDesafios.length">
              <li v-for="ed in sessionEncontrosDesafios" :key="ed.id" class="text-slate-600 dark:text-slate-400">
                <span class="font-semibold">{{ ed.title }}:</span> {{ ed.description || 'Sem descrição.' }} (Mecânica:
                {{ ed.mecanica || 'N/A' }})
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhum encontro ou desafio.</p>
          </div>

          <!-- Gancho para Próxima Aventura -->
          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow">
            <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon
                :icon="['fas', 'arrow-right']" class="text-slate-500" /><span>Gancho para Próxima Aventura</span></h4>
            <p class="text-slate-600 dark:text-slate-400">
              {{ selectedSession.gancho_proxima_aventura || 'Nenhum gancho definido.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import SessionForm from './SessionForm.vue';

const props = defineProps({
  selectedSession: {
    type: Object,
    default: null
  },
  selectedCampaignName: {
    type: String,
    default: ''
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['sessionUpdated', 'creationCancelled', 'startEditing']);

// Simply use computed properties bound to selectedSession since the store provides it deeply populated
const sessionGanchosPersonagens = computed(() => props.selectedSession?.ganchos_personagens || props.selectedSession?.session_ganchos_personagens || []);
const sessionLocaisInteressantes = computed(() => props.selectedSession?.locais_interessantes || props.selectedSession?.session_locais_interessantes || []);
const sessionNpcsImportantes = computed(() => props.selectedSession?.npcs_importantes || props.selectedSession?.session_npcs_importantes || []);
const sessionObjetivos = computed(() => props.selectedSession?.objetivos || props.selectedSession?.session_objetivos || []);
const sessionSegredosRumores = computed(() => props.selectedSession?.segredos_rumores || props.selectedSession?.session_segredos_rumores || []);
const sessionTesourosRecompensas = computed(() => props.selectedSession?.tesouros_recompensas || props.selectedSession?.session_tesouros_recompensas || []);
const sessionEncontrosDesafios = computed(() => props.selectedSession?.encontros_desafios || props.selectedSession?.session_encontros_desafios || []);

const saveSession = async (sessionData) => {
  // Let parent (view) handle it through the store
  emit('sessionUpdated', sessionData);
};

const cancelForm = () => {
  emit('creationCancelled');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>
