import { defineStore } from 'pinia';

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: [],
    activeCampaign: null,
    loading: false,
    error: null,
    fetched: false
  }),
  actions: {
    async fetchCampaigns() {
      if (this.fetched) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        this.campaigns = data;
        this.fetched = true;
        if (data.length > 0 && !this.activeCampaign) {
          this.setActiveCampaign(data[0]);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    setActiveCampaign(campaign) {
      this.activeCampaign = campaign;
    },
    async addCampaign(campaign) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaign)
        });
        if (!response.ok) throw new Error('Failed to add campaign');
        const data = await response.json();
        this.campaigns.unshift(data);
        if (!this.activeCampaign) {
          this.setActiveCampaign(data);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateCampaign(campaign) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/campaigns?id=${campaign.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaign)
        });
        if (!response.ok) throw new Error('Failed to update campaign');
        
        // Emulate optimistic update
        const index = this.campaigns.findIndex(c => c.id === campaign.id);
        if (index !== -1) {
          this.campaigns[index] = { ...this.campaigns[index], ...campaign };
        }
        if (this.activeCampaign && this.activeCampaign.id === campaign.id) {
          this.setActiveCampaign(this.campaigns[index]);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteCampaign(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/campaigns?id=${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete campaign');
        
        this.campaigns = this.campaigns.filter(c => c.id !== id);
        if (this.activeCampaign && this.activeCampaign.id === id) {
          this.setActiveCampaign(this.campaigns.length > 0 ? this.campaigns[0] : null);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
