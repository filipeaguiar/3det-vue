<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
      
      <!-- Header -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-amber-50 dark:bg-slate-900/50">
        <div>
          <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
            Gerador de Sessão com IA
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">O Co-Mestre ajudará você a estruturar sua próxima aventura.</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-grow overflow-y-auto p-6 space-y-8">
        
        <!-- Step 1: Core Idea -->
        <section>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <span class="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Qual a ideia central da sessão?
          </label>
          <textarea 
            v-model="userInput"
            rows="4"
            class="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
            placeholder="Ex: Os heróis precisam escoltar um príncipe mercador através do Deserto de Sal, enfrentando tempestades de areia e nômades hostis..."
          ></textarea>
        </section>

        <!-- Step 2: Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- NPCs -->
          <section>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <span class="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Participação de NPCs
            </label>
            <div class="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="npc in availableNpcs" :key="npc.id" 
                class="p-3 rounded-xl border transition-all cursor-pointer"
                :class="isNpcSelected(npc.id) ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'"
                @click="toggleNpc(npc)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ npc.name }}</span>
                  <font-awesome-icon v-if="isNpcSelected(npc.id)" :icon="['fas', 'check-circle']" class="text-amber-500" />
                </div>
                <input 
                  v-if="isNpcSelected(npc.id)"
                  v-model="selectedNpcs.find(n => n.id === npc.id).role"
                  @click.stop
                  placeholder="Qual o papel dele?"
                  class="w-full text-xs rounded-lg border-amber-200 dark:border-amber-900/30 dark:bg-slate-800 py-1"
                />
              </div>
              <p v-if="availableNpcs.length === 0" class="text-slate-500 text-xs italic">Nenhum NPC encontrado.</p>
            </div>
          </section>

          <!-- Monsters -->
          <section>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <span class="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Inimigos e Desafios
            </label>
            <div class="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="monstro in availableMonstros" :key="monstro.id" 
                class="p-3 rounded-xl border transition-all cursor-pointer"
                :class="isMonstroSelected(monstro.id) ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-red-300'"
                @click="toggleMonstro(monstro)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ monstro.name }}</span>
                  <font-awesome-icon v-if="isMonstroSelected(monstro.id)" :icon="['fas', 'check-circle']" class="text-red-500" />
                </div>
                <input 
                  v-if="isMonstroSelected(monstro.id)"
                  v-model="selectedMonstros.find(m => m.id === monstro.id).role"
                  @click.stop
                  placeholder="Como ele aparece?"
                  class="w-full text-xs rounded-lg border-red-200 dark:border-red-900/30 dark:bg-slate-800 py-1"
                />
              </div>
              <p v-if="availableMonstros.length === 0" class="text-slate-500 text-xs italic">Nenhum monstro encontrado.</p>
            </div>
          </section>
        </div>

        <!-- Generation Progress -->
        <div v-if="isGenerating" class="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-900/30">
          <div class="flex items-center gap-4 mb-4">
            <div class="animate-spin text-amber-500">
              <font-awesome-icon :icon="['fas', 'circle-notch']" size="2xl" />
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-200">O Co-Mestre está escrevendo...</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Isso pode levar alguns segundos dependendo da complexidade.</p>
            </div>
          </div>
          <!-- Progress Preview -->
          <div class="text-xs text-slate-400 font-mono bg-white dark:bg-black/20 p-3 rounded-lg max-h-32 overflow-hidden italic">
            {{ partialObject?.title || 'Preparando contexto...' }}
            <br>
            {{ partialObject?.description || '' }}
          </div>
        </div>

        <!-- Error State -->
        <div v-if="aiError" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30">
          <h4 class="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
            Erro na Geração
          </h4>
          <p class="text-sm text-red-600 dark:text-red-300">{{ aiError }}</p>
          <p class="text-xs text-red-500 mt-2">Verifique o console do navegador para mais detalhes técnicos.</p>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
        <button 
          @click="$emit('close')"
          class="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
        >
          Cancelar
        </button>
        <button 
          @click="generate"
          :disabled="!userInput || isGenerating"
          class="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'sparkles']" />
          {{ isGenerating ? 'Gerando...' : 'Gerar Sessão' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { useMonstrosStore } from '../stores/monstros';
import { useCampaignsStore } from '../stores/campaigns';
import { experimental_useObject as useObject } from '@ai-sdk/vue';
import { z } from 'zod';

const emit = defineEmits(['close', 'generated']);

const npcsStore = useNpcsStore();
const monstrosStore = useMonstrosStore();
const campaignsStore = useCampaignsStore();

const userInput = ref('');
const selectedNpcs = ref([]);
const selectedMonstros = ref([]);
const availableNpcs = ref([]);
const availableMonstros = ref([]);

const isGenerating = ref(false);

// Esquema para o useObject (mesmo do backend)
const sessionSchema = z.object({
  title: z.string(),
  description: z.string(),
  comeco_forte: z.string(),
  objetivos: z.array(z.object({ description: z.string(), completed: z.boolean() })),
  ganchos_personagens: z.array(z.object({ personagem_name: z.string(), description: z.string() })),
  locais_interessantes: z.array(z.object({ name: z.string(), description: z.string(), caracteristicas: z.array(z.string()) })),
  npcs_importantes: z.array(z.object({ name: z.string(), role: z.string(), notes: z.string() })),
  encontros_desafios: z.array(z.object({ name: z.string(), description: z.string(), mecanica: z.string() })),
  segredos_rumores: z.array(z.object({ description: z.string(), revealed: z.boolean() })),
  tesouros_recompensas: z.array(z.object({ description: z.string(), claimed: z.boolean() })),
  gancho_proxima_aventura: z.string()
});

const aiError = ref(null);

const { object: partialObject, submit, isLoading } = useObject({
  api: '/api/ai?action=generate-session',
  schema: sessionSchema,
  onFinish: (event) => {
    console.log("Evento completo da IA:", event);
    isGenerating.value = false;
    
    if (event.error) {
      console.error("Erro reportado pelo AI SDK:", event.error);
      aiError.value = event.error.message || 'Ocorreu um erro desconhecido durante a geração.';
      return;
    }
    
    if (event.object) {
      emit('generated', event.object);
    } else {
      aiError.value = 'A resposta da IA veio vazia (undefined).';
    }
  },
  onError: (error) => {
    console.error("Erro onError do AI SDK:", error);
    aiError.value = error.message;
    isGenerating.value = false;
  }
});

const isNpcSelected = (id) => selectedNpcs.value.some(n => n.id === id);
const isMonstroSelected = (id) => selectedMonstros.value.some(m => m.id === id);

const toggleNpc = (npc) => {
  const index = selectedNpcs.value.findIndex(n => n.id === npc.id);
  if (index === -1) {
    selectedNpcs.value.push({ id: npc.id, name: npc.name, role: '' });
  } else {
    selectedNpcs.value.splice(index, 1);
  }
};

const toggleMonstro = (monstro) => {
  const index = selectedMonstros.value.findIndex(m => m.id === monstro.id);
  if (index === -1) {
    selectedMonstros.value.push({ id: monstro.id, name: monstro.name, role: '' });
  } else {
    selectedMonstros.value.splice(index, 1);
  }
};

const generate = () => {
  if (!campaignsStore.activeCampaign) return;
  
  isGenerating.value = true;
  submit({
    campaignId: campaignsStore.activeCampaign.id,
    userInput: userInput.value,
    selectedNpcs: selectedNpcs.value,
    selectedMonstros: selectedMonstros.value
  });
};

onMounted(async () => {
  const campaignId = campaignsStore.activeCampaign?.id;
  if (campaignId) {
    await Promise.all([
      npcsStore.fetchNpcs(campaignId),
      monstrosStore.fetchMonstros(campaignId)
    ]);
    availableNpcs.value = npcsStore.npcs;
    availableMonstros.value = monstrosStore.monstros;
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
