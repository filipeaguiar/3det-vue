import { defineStore } from 'pinia';

export const useNpcsStore = defineStore('npcs', {
  state: () => ({
    npcs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNpcs(campaignId) {
      this.loading = true;
      try {
        const url = campaignId ? `/api/entities/npcs?campaign_id=${campaignId}` : '/api/entities/npcs';
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to fetch npcs: ${response.status} - ${text}`);
          throw new Error(`Failed to fetch npcs: ${response.status} - ${text}`);
        }
        this.npcs = await response.json();
      } catch (error) {
        this.error = error;
        console.error('Error fetching npcs:', error);
      } finally {
        this.loading = false;
      }
    },
    async addNpc(npcData) {
      this.loading = true;
      try {
        // Formata para o payload da API
        const payload = {
          ...npcData,
          vantagens: (npcData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (npcData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (npcData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (npcData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch('/api/entities/npcs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Failed to add npc');
        
        // Refetch to get populated relations
        await this.fetchNpcs(npcData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error adding npc:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateNpc(npcData) {
      this.loading = true;
      try {
        const payload = {
          ...npcData,
          vantagens: (npcData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (npcData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (npcData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (npcData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch(`/api/entities/npcs/${npcData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update npc');
        
        await this.fetchNpcs(npcData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error updating npc:', error);
      } finally {
        this.loading = false;
      }
    },
    async uploadImage(file) {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Send as raw body if using @vercel/blob put via stream,
        // or just pass the filename in URL and file as body.
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const blob = await response.json();
        return blob.url;
      } catch (error) {
        this.error = error;
        console.error('Error uploading image:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteNpc(npcId) {
      this.loading = true;
      try {
        const response = await fetch(`/api/entities/npcs/${npcId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete npc');
        this.npcs = this.npcs.filter(p => p.id !== npcId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting npc:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});