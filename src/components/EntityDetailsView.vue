<template>
  <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-slate-800 dark:text-slate-100">
    <div v-if="selectedEntity">
      <h2 class="text-3xl font-bold mb-4 text-amber-700 dark:text-amber-500">{{ selectedEntity.name }}</h2>
      <p class="text-md text-slate-600 dark:text-slate-400 italic mb-2"><span class="font-semibold">Conceito:</span> {{ selectedEntity.concept }}</p>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4"><span class="font-semibold">Arquétipo:</span> {{ selectedEntity.archetype }} • {{ selectedEntity.pontos }} pontos</p>

      <div class="flex flex-col sm:flex-row gap-6 items-start">
        <div v-if="selectedEntity.image" class="flex-shrink-0 w-full sm:w-48">
          <img :src="getImageUrl(selectedEntity.image)" :alt="selectedEntity.name"
            class="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div class="flex-grow">

          <!-- Attributes -->
          <div class="mb-4">
            <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><i
                class="fa-solid fa-list-ol fa-fw text-slate-500"></i><span>Atributos</span></h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-2">
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-hand-fist fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Poder</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Poder
                    }}</span>
                </div>
              </div>
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-brain fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Habilidade</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Habilidade
                    }}</span>
                </div>
              </div>
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-shield-halved fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Resistência</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Resistencia
                    }}</span>
                </div>
              </div>
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-bolt fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Ação</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Acao
                    }}</span>
                </div>
              </div>
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Mana</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Mana
                    }}</span>
                </div>
              </div>
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-x-3 shadow-sm">
                <i class="fa-solid fa-heart-pulse fa-fw fa-2x text-amber-700 dark:text-amber-500"></i>
                <div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Vida</span>
                  <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Vida
                    }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pericias -->
          <div class="mb-4">
            <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><i
                class="fa-solid fa-graduation-cap fa-fw text-slate-500"></i><span>Perícias</span></h4>
            <ul v-if="periciasList.length > 0"
              class="list-disc list-inside ml-4 text-slate-600 dark:text-slate-400">
              <li v-for="p in periciasList" :key="p.id">{{ p.name }}</li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhuma</p>
          </div>

          <!-- Vantagens -->
          <div class="mb-4">
            <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><i
                class="fa-solid fa-thumbs-up fa-fw text-green-600"></i><span>Vantagens</span></h4>
            <ul v-if="vantagensList.length > 0"
              class="list-disc list-inside ml-4 text-slate-600 dark:text-slate-400">
              <li v-for="v in vantagensList" :key="v.id">
                <span class="font-semibold">{{ v.name }}</span>
                <span v-if="v.cost" class="text-xs text-slate-500 dark:text-slate-400 ml-1">({{ v.cost }})</span>
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhuma</p>
          </div>

          <!-- Desvantagens -->
          <div class="mb-4">
            <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><i
                class="fa-solid fa-thumbs-down fa-fw text-red-600"></i><span>Desvantagens</span></h4>
            <ul v-if="desvantagensList.length > 0"
              class="list-disc list-inside ml-4 text-slate-600 dark:text-slate-400">
              <li v-for="d in desvantagensList" :key="d.id">
                <span class="font-semibold">{{ d.name }}</span>
                <span v-if="d.cost" class="text-xs text-slate-500 dark:text-slate-400 ml-1">({{ d.cost }})</span>
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhuma</p>
          </div>

          <!-- Tecnicas -->
          <div class="mb-4">
            <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><i
                class="fa-solid fa-hat-wizard fa-fw text-purple-600"></i><span>Técnicas</span></h4>
            <ul v-if="tecnicasList.length > 0"
              class="list-disc list-inside ml-4 text-slate-600 dark:text-slate-400">
              <li v-for="t in tecnicasList" :key="t.id">
                <span class="font-semibold">{{ t.name }}</span>
                <span v-if="t.cost" class="text-xs text-slate-500 dark:text-slate-400 ml-1">({{ t.cost }})</span>
              </li>
            </ul>
            <p v-else class="text-slate-600 dark:text-slate-400">Nenhuma</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-lg text-center text-slate-600 dark:text-slate-400">Selecione uma entidade para ver os detalhes.</p>
    </div>

    
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  selectedEntity: {
    type: Object,
    default: null,
  },
  selectedCampaignName: {
    type: String,
    default: '',
  },
  entityType: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getImageUrl = (url) => {
  if (!url) return null;
  // If it's a Vercel Blob private URL, use our proxy
  if (url.includes('blob.vercel-storage.com')) {
    return `/api/blob-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

// Resolve a pluralização dinâmica do tipo de entidade ('personagem' -> 'personagens', 'npc' -> 'npcs', 'monstro' -> 'monstros')
const pluralType = computed(() => {
  if (props.entityType === 'personagem') return 'personagens';
  if (props.entityType === 'npc') return 'npcs';
  if (props.entityType === 'monstro') return 'monstros';
  return props.entityType; // Caso já venha plural
});

const periciasList = computed(() => {
  if (!props.selectedEntity) return [];
  // Tenta o formato SQLite limpo e direto da API
  if (props.selectedEntity.pericias && props.selectedEntity.pericias.length > 0) {
    return props.selectedEntity.pericias;
  }
  // Fallback de retrocompatibilidade para o formato legado aninhado
  const legacy = props.selectedEntity[`${pluralType.value}_pericias`];
  if (legacy && legacy.length > 0) {
    return legacy.map(p => ({
      id: p.pericia_id,
      name: p.pericias?.name || ''
    }));
  }
  return [];
});

const vantagensList = computed(() => {
  if (!props.selectedEntity) return [];
  if (props.selectedEntity.vantagens && props.selectedEntity.vantagens.length > 0) {
    return props.selectedEntity.vantagens;
  }
  const legacy = props.selectedEntity[`${pluralType.value}_vantagens`];
  if (legacy && legacy.length > 0) {
    return legacy.map(v => ({
      id: v.vantagem_id,
      name: v.vantagens?.name || ''
    }));
  }
  return [];
});

const desvantagensList = computed(() => {
  if (!props.selectedEntity) return [];
  if (props.selectedEntity.desvantagens && props.selectedEntity.desvantagens.length > 0) {
    return props.selectedEntity.desvantagens;
  }
  const legacy = props.selectedEntity[`${pluralType.value}_desvantagens`];
  if (legacy && legacy.length > 0) {
    return legacy.map(d => ({
      id: d.desvantagem_id,
      name: d.desvantagens?.name || ''
    }));
  }
  return [];
});

const tecnicasList = computed(() => {
  if (!props.selectedEntity) return [];
  if (props.selectedEntity.tecnicas && props.selectedEntity.tecnicas.length > 0) {
    return props.selectedEntity.tecnicas;
  }
  const legacy = props.selectedEntity[`${pluralType.value}_tecnicas`];
  if (legacy && legacy.length > 0) {
    return legacy.map(t => ({
      id: t.tecnica_id,
      name: t.tecnicas?.name || ''
    }));
  }
  return [];
});
</script>