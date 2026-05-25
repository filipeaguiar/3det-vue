<template>
  <section id="sessoes" class="h-full relative">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <div class="flex flex-col gap-4">
        <!-- AI Generator Trigger -->
        <button 
          @click="showAiModal = true"
          class="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
        >
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="group-hover:rotate-12 transition-transform" />
          <span>✨ Gerar com IA</span>
        </button>

        <EntityListView
          :entities="sessionsStore.sessions"
          :selectedEntity="sessionsStore.activeSession"
          :loading="sessionsStore.loading"
          :error="sessionsStore.error"
          entityTitle="Sessões"
          :entityIcon="['fas', 'scroll']"
          :showCampaignFilter="true"
          :campaigns="campaignsStore.campaigns"
          :selectedCampaignId="campaignsStore.activeCampaign?.id"
          @update:selectedCampaignId="campaignsStore.setActiveCampaign(campaignsStore.campaigns.find(c => c.id === $event))"
          @selectEntity="selectSession"
          @addEntity="addSession"
          @deleteEntity="deleteSession"
          @editEntity="editSession"
          class="flex-grow overflow-y-auto"
        />
      </div>

      <div class="md:col-span-2 h-full">
        <SessionDetailsView
          v-if="!isEditMode"
          :selectedSession="sessionsStore.activeSession"
          :loading="sessionsStore.loading"
          @startEditing="editSession(sessionsStore.activeSession)"
          class="h-full"
        />
        <SessionForm
          v-else
          :session="sessionToEdit"
          :campaignId="campaignsStore.activeCampaign?.id"
          @sessionUpdated="handleSessionUpdate"
          @creationCancelled="cancelCreation"
          class="h-full"
        />
      </div>
    </div>

    <!-- AI Generator Modal -->
    <AISessionGeneratorModal 
      v-if="showAiModal"
      @close="showAiModal = false"
      @generated="handleAiGenerated"
    />
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="fixed bottom-6 right-6 text-white p-4 rounded-2xl shadow-xl z-50 animate-bounce-in min-w-[300px] text-center font-bold">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useSessionsStore } from '../stores/sessions';
import { useCampaignsStore } from '../stores/campaigns';
import EntityListView from '../components/EntityListView.vue';
import SessionDetailsView from '../components/SessionDetailsView.vue';
import SessionForm from '../components/SessionForm.vue';
import AISessionGeneratorModal from '../components/AISessionGeneratorModal.vue';

const sessionsStore = useSessionsStore();
const campaignsStore = useCampaignsStore();

const { activeCampaign } = storeToRefs(campaignsStore);

const isEditMode = ref(false);
const sessionToEdit = ref(null);
const message = ref('');
const messageType = ref('');
const showAiModal = ref(false);

const selectSession = async (session) => {
  // We need to fetch the full details for the selected session
  if (session && session.id) {
    await sessionsStore.fetchSessionDetails(session.id);
  } else {
    sessionsStore.activeSession = session;
  }
  isEditMode.value = false;
};

const addSession = () => {
  sessionToEdit.value = {}; // Novo objeto para o formulário
  isEditMode.value = true;
};

const editSession = (session) => {
  sessionToEdit.value = { ...session }; // Clona a sessão para edição
  isEditMode.value = true;
};

const handleAiGenerated = (aiSession) => {
  sessionToEdit.value = aiSession;
  isEditMode.value = true;
  showAiModal.value = false;
  message.value = 'Rascunho gerado pela IA com sucesso!';
  messageType.value = 'success';
  setTimeout(() => { message.value = ''; }, 3000);
};

const deleteSession = async (id) => {
  try {
    await sessionsStore.deleteSession(id, campaignsStore.activeCampaign.id);
    message.value = 'Sessão excluída com sucesso!';
    messageType.value = 'success';
    setTimeout(() => { message.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao excluir sessão: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; }, 5000);
  }
};

const handleSessionUpdate = async (sessionData) => {
  try {
    if (sessionData.id) {
      await sessionsStore.updateSession(sessionData);
    } else {
      await sessionsStore.addSession(sessionData);
    }
    isEditMode.value = false;
    sessionToEdit.value = null;
    message.value = 'Sessão salva com sucesso!';
    messageType.value = 'success';
    setTimeout(() => { message.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao salvar sessão: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; }, 5000);
  }
};

const cancelCreation = () => {
  isEditMode.value = false;
  sessionToEdit.value = null;
  if (!sessionsStore.activeSession && sessionsStore.sessions.length > 0) {
    sessionsStore.activeSession = sessionsStore.sessions[0];
  }
};

const loadInitialData = async (campaign) => {
  if (!campaign) {
    sessionsStore.sessions = [];
    sessionsStore.activeSession = null;
    return;
  }
  await sessionsStore.fetchSessions(campaign.id);
  await sessionsStore.fetchLatestSessionWithDetails(campaign.id);
  if (!sessionsStore.activeSession && sessionsStore.sessions.length > 0) {
    sessionsStore.activeSession = sessionsStore.sessions[0];
  }
  // Removemos o auto-addSession para não atrapalhar o fluxo da IA
};

watch(activeCampaign, (newCampaign) => {
  loadInitialData(newCampaign);
}, { immediate: true });

onMounted(() => {
  if (!campaignsStore.activeCampaign && campaignsStore.campaigns.length > 0) {
    campaignsStore.setActiveCampaign(campaignsStore.campaigns[0]);
  }
  loadInitialData(campaignsStore.activeCampaign);
});

</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.9) translateY(20px); opacity: 0; }
  70% { transform: scale(1.05) translateY(-5px); opacity: 1; }
  100% { transform: scale(1) translateY(0); }
}
.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
