<template>
  <section id="sessoes" class="h-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
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
        class="h-full overflow-y-auto"
      />

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
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
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

const sessionsStore = useSessionsStore();
const campaignsStore = useCampaignsStore();

const { activeCampaign } = storeToRefs(campaignsStore);

const isEditMode = ref(false);
const sessionToEdit = ref(null);
const message = ref('');
const messageType = ref('');

const selectSession = (session) => {
  sessionsStore.activeSession = session;
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
    // Se não houver uma sessão "mais recente" (talvez a primeira vez), seleciona a primeira da lista.
    sessionsStore.activeSession = sessionsStore.sessions[0];
  }
  if (sessionsStore.sessions.length === 0) {
    await nextTick();
    addSession();
  }
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
/* Estilos para a scrollbar, se necessário */
</style>