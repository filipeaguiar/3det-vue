import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    hasFetchedSession: false
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    async signOut() {
      this.loading = true;
      try {
        await fetch('/api/auth', { method: 'DELETE' });
        this.user = null;
      } catch (error) {
        this.error = error;
        console.error('Error signing out:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      if (this.hasFetchedSession) return;
      
      this.loading = true;
      try {
        const response = await fetch('/api/auth');
        if (response.ok) {
          const data = await response.json();
          this.user = data.user;
        } else {
          this.user = null;
        }
        this.hasFetchedSession = true;
      } catch (error) {
        this.error = error;
        console.error('Error fetching user session:', error);
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
  },
});