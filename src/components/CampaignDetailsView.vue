<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <div v-if="campaign" class="flex-grow flex flex-col h-full">
      <div class="flex justify-between items-start mb-2 gap-x-4">
        <div>
          <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500">{{ campaign.name }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Criada em: {{ formatDate(campaign.created_at) }}</p>
        </div>
        <button 
          @click="$emit('startEditing')" 
          class="px-4 py-2 text-sm font-semibold rounded-xl text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/70 border border-amber-200/50 dark:border-amber-900/30 transition-all duration-300 flex items-center gap-x-2 focus:outline-none focus:ring-4 focus:ring-amber-500/10 shadow-sm whitespace-nowrap"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          <span>Editar Campanha</span>
        </button>
      </div>
      <p class="text-md text-slate-600 dark:text-slate-400 italic mb-4">{{ campaign.description || 'Nenhuma descrição.' }}</p>

      <div class="mt-6 flex-grow flex flex-col">
        <h4 class="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-300 dark:border-slate-600 pb-2">Diário da Campanha</h4>
        
        <div v-if="chapterLoading" class="text-center text-slate-500 dark:text-slate-400">Carregando diário...</div>
        <div v-else-if="chapterError" class="text-center text-red-500">Erro ao carregar diário: {{ chapterError.message }}</div>
        <div v-else-if="!latestChapter" class="text-center text-slate-500 dark:text-slate-400 flex-grow flex items-center justify-center">
          <p>Nenhum capítulo encontrado para esta campanha.</p>
        </div>
        <div v-else class="flex-grow overflow-y-auto">
          <h5 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">Capítulo {{ latestChapter.chapter_number }} - {{ formatDate(latestChapter.created_at) }}</h5>
          <MarkdownRenderer :markdown="latestChapter.content" />
        </div>

        <div class="mt-4 flex justify-end gap-x-2">
          <button @click="addChapter" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span>Novo Capítulo</span>
          </button>
          <button v-if="latestChapter" @click="editChapter(latestChapter)" class="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            <span>Editar Último</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-slate-500 dark:text-slate-400 h-full flex items-center justify-center">
      <p>Selecione uma Campanha na lista para ver os detalhes ou adicione uma nova.</p>
    </div>

    <ChapterForm
      v-if="showChapterForm"
      :chapter="chapterToEdit"
      :campaignId="campaign.id"
      @save="handleSaveChapter"
      @close="handleCloseChapterForm"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue';
import { useCampaignChaptersStore } from '../stores/campaignChapters';
import { storeToRefs } from 'pinia';
import MarkdownRenderer from './MarkdownRenderer.vue';
import ChapterForm from './ChapterForm.vue';

const props = defineProps({
  campaign: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['startEditing']);

const campaignChaptersStore = useCampaignChaptersStore();
const { latestChapter, loading: chapterLoading, error: chapterError } = storeToRefs(campaignChaptersStore);

const showChapterForm = ref(false);
const chapterToEdit = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const addChapter = () => {
  chapterToEdit.value = null;
  showChapterForm.value = true;
};

const editChapter = (chapter) => {
  chapterToEdit.value = { ...chapter };
  showChapterForm.value = true;
};

const handleSaveChapter = async (chapterData) => {
  if (chapterData.id) {
    await campaignChaptersStore.updateChapter(props.campaign.id, chapterData);
  } else {
    await campaignChaptersStore.addChapter(props.campaign.id, chapterData);
  }
  showChapterForm.value = false;
  chapterToEdit.value = null;
};

const handleCloseChapterForm = () => {
  showChapterForm.value = false;
  chapterToEdit.value = null;
};

watch(() => props.campaign, async (newCampaign) => {
  if (newCampaign) {
    await campaignChaptersStore.fetchChapters(newCampaign.id);
  }
}, { immediate: true });
</script>
