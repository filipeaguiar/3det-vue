import { defineStore } from 'pinia';

export const usePersonagensStore = defineStore('personagens', {
  state: () => ({
    personagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPersonagens(campaignId) {
      this.loading = true;
      try {
        const url = campaignId ? `/api/entities/personagens?campaign_id=${campaignId}` : '/api/entities/personagens';
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to fetch personagens: ${response.status} - ${text}`);
          throw new Error(`Failed to fetch personagens: ${response.status} - ${text}`);
        }
        this.personagens = await response.json();
      } catch (error) {
        this.error = error;
        console.error('Error fetching personagens:', error);
      } finally {
        this.loading = false;
      }
    },
    async addPersonagem(personagemData) {
      this.loading = true;
      try {
        // Formata para o payload da API
        const payload = {
          ...personagemData,
          vantagens: (personagemData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (personagemData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (personagemData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (personagemData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch('/api/entities/personagens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Failed to add personagem');
        
        // Refetch to get populated relations
        await this.fetchPersonagens(personagemData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error adding personagem:', error);
      } finally {
        this.loading = false;
      }
    },
    async updatePersonagem(personagemData) {
      this.loading = true;
      try {
        const payload = {
          ...personagemData,
          vantagens: (personagemData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (personagemData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (personagemData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (personagemData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch(`/api/entities/personagens/${personagemData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update personagem');
        
        await this.fetchPersonagens(personagemData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error updating personagem:', error);
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
    async deletePersonagem(personagemId) {
      this.loading = true;
      try {
        const response = await fetch(`/api/entities/personagens/${personagemId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete personagem');
        this.personagens = this.personagens.filter(p => p.id !== personagemId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting personagem:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});