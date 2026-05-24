<template>
  <section id="campanha" class="h-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <EntityListView :entities="campaignsStore.campaigns" :selectedEntity="selectedCampaign"
        :loading="campaignsStore.loading" :error="campaignsStore.error" entityTitle="Campanhas"
        :entityIcon="['fas', 'book-open']" :showCampaignFilter="false" @selectEntity="selectCampaign"
        @addEntity="addCampaign" @deleteEntity="deleteCampaign" @editEntity="editCampaign"
        class="h-full overflow-y-auto" />

      <div class="md:col-span-2 h-full">
        <CampaignDetailsView v-if="!isEditMode" :campaign="selectedCampaign"
          @startEditing="editCampaign" class="h-full" />
        <CampaignForm v-else :campaign="campaignToEdit" @save="handleSaveCampaign" @close="handleCloseForm"
          class="h-full" />
      </div>
    </div>
    <div v-if="message" :class="{ 'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error' }"
      class="text-white p-3 rounded-lg mt-4 text-center">
      {{ message }}
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import EntityListView from '../components/EntityListView.vue';
import CampaignForm from '../components/CampaignForm.vue';
import CampaignDetailsView from '../components/CampaignDetailsView.vue';

const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();
const { campaigns, loading, error, activeCampaign } = storeToRefs(campaignsStore);

const selectedCampaign = ref(null);
const isEditMode = ref(false);
const campaignToEdit = ref(null);
const message = ref('');
const messageType = ref('');

const selectCampaign = (campaign) => {
  selectedCampaign.value = campaign;
  isEditMode.value = false;
};

const addCampaign = () => {
  campaignToEdit.value = null;
  isEditMode.value = true;
};

const editCampaign = (campaign) => {
  campaignToEdit.value = { ...campaign };
  isEditMode.value = true;
};

const deleteCampaign = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta campanha? Isso excluirá todos os personagens, npcs e sessões associados!')) {
    try {
      await campaignsStore.deleteCampaign(id);
      message.value = 'Campanha excluída com sucesso!';
      messageType.value = 'success';
      selectedCampaign.value = null;
      isEditMode.value = false;
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir campanha: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveCampaign = async (campaignData) => {
  try {
    if (campaignData.id) {
      await campaignsStore.updateCampaign(campaignData);
      message.value = 'Campanha atualizada com sucesso!';
      messageType.value = 'success';
    } else {
      campaignData.user_id = authStore.user.id; // Atribui o user_id
      await campaignsStore.addCampaign(campaignData);
      message.value = 'Campanha adicionada com sucesso!';
      messageType.value = 'success';
    }
    isEditMode.value = false;
    campaignToEdit.value = null;
    // Re-fetch campaigns to update the list and potentially activeCampaign
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0 && !selectedCampaign.value) {
      selectedCampaign.value = campaignsStore.campaigns[0];
    } else if (campaignsStore.campaigns.length > 0 && campaignData.id) {
      // If an existing campaign was updated, re-select it to show updated details
      selectedCampaign.value = campaignsStore.campaigns.find(c => c.id === campaignData.id) || campaignsStore.campaigns[0];
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  isEditMode.value = false;
  campaignToEdit.value = null;
  if (!selectedCampaign.value && campaignsStore.campaigns.length > 0) {
    selectedCampaign.value = campaignsStore.campaigns[0];
  }
};

// Watch for changes in campaigns and set selectedCampaign if none is selected
watch(campaigns, (newCampaigns) => {
  if (!selectedCampaign.value && newCampaigns.length > 0) {
    selectedCampaign.value = newCampaigns[0];
  }
}, { immediate: true });

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0 && !selectedCampaign.value) {
      selectedCampaign.value = campaignsStore.campaigns[0];
    }
  }
});
</script>
