import { defineStore } from 'pinia';

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    activeSession: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSessions(campaignId) {
      this.loading = true;
      this.error = null;
      if (!campaignId) {
        this.sessions = [];
        this.loading = false;
        return;
      }
      try {
        const response = await fetch(`/api/sessions?campaign_id=${campaignId}`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        this.sessions = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchLatestSessionWithDetails(campaignId) {
      this.loading = true;
      this.error = null;
      this.activeSession = null;
      if (!campaignId) {
        this.loading = false;
        return;
      }
      try {
        // Find latest session from the basic fetch
        await this.fetchSessions(campaignId);
        if (this.sessions.length > 0) {
          const latestId = this.sessions[0].id;
          const response = await fetch(`/api/sessions?id=${latestId}`);
          if (!response.ok) {
              if(response.status === 404) {
                 this.activeSession = null;
                 return;
              }
              throw new Error('Failed to fetch session details');
          }
          this.activeSession = await response.json();
        } else {
          this.activeSession = null;
        }
      } catch (err) {
        this.error = err.message;
        console.error('Erro ao buscar sessão mais recente:', err);
      } finally {
        this.loading = false;
      }
    },
    async addSession(sessionData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) throw new Error('Failed to create session');
        
        await this.fetchLatestSessionWithDetails(sessionData.campaign_id);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateSession(sessionData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/sessions?id=${sessionData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) throw new Error('Failed to update session');
        
        await this.fetchLatestSessionWithDetails(sessionData.campaign_id);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteSession(id, campaignId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/sessions?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete session');
        
        await this.fetchLatestSessionWithDetails(campaignId);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
