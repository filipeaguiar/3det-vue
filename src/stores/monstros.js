import { defineStore } from 'pinia';

export const useMonstrosStore = defineStore('monstros', {
  state: () => ({
    monstros: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMonstros(campaignId) {
      this.loading = true;
      try {
        const url = campaignId ? `/api/entities?type=monstros&campaign_id=${campaignId}` : '/api/entities?type=monstros';
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to fetch monstros: ${response.status} - ${text}`);
          throw new Error(`Failed to fetch monstros: ${response.status} - ${text}`);
        }
        this.monstros = await response.json();
      } catch (error) {
        this.error = error;
        console.error('Error fetching monstros:', error);
      } finally {
        this.loading = false;
      }
    },
    async addMonstro(monstroData) {
      this.loading = true;
      try {
        // Formata para o payload da API
        const payload = {
          ...monstroData,
          vantagens: (monstroData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (monstroData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (monstroData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (monstroData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch('/api/entities?type=monstros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Failed to add monstro');
        
        // Refetch to get populated relations
        await this.fetchMonstros(monstroData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error adding monstro:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateMonstro(monstroData) {
      this.loading = true;
      try {
        const payload = {
          ...monstroData,
          vantagens: (monstroData.vantagens || []).map(v => v.vantagem_id || v.id).filter(id => id),
          desvantagens: (monstroData.desvantagens || []).map(v => v.desvantagem_id || v.id).filter(id => id),
          pericias: (monstroData.pericias || []).map(v => v.pericia_id || v.id).filter(id => id),
          tecnicas: (monstroData.tecnicas || []).map(v => v.tecnica_id || v.id).filter(id => id),
        };

        const response = await fetch(`/api/entities?type=monstros&id=${monstroData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update monstro');
        
        await this.fetchMonstros(monstroData.campaign_id);
      } catch (error) {
        this.error = error;
        console.error('Error updating monstro:', error);
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
    async deleteMonstro(monstroId) {
      this.loading = true;
      try {
        const response = await fetch(`/api/entities?type=monstros&id=${monstroId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete monstro');
        this.monstros = this.monstros.filter(p => p.id !== monstroId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting monstro:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
