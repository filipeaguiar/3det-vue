import { defineStore } from 'pinia';

export const useCampaignChaptersStore = defineStore('campaignChapters', {
  state: () => ({
    chapters: [],
    latestChapter: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchChapters(campaignId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/chapters?campaign_id=${campaignId}`);
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();
        
        this.chapters = data;
        if (data.length > 0) {
          this.latestChapter = data[0];
        } else {
          this.latestChapter = null;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addChapter(chapter) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/api/chapters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapter)
        });
        if (!response.ok) throw new Error('Failed to create chapter');
        const data = await response.json();
        
        this.chapters.unshift(data);
        // Sort chapters by chapter_number descending
        this.chapters.sort((a, b) => b.chapter_number - a.chapter_number);
        this.latestChapter = this.chapters[0];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateChapter(chapter) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/chapters/${chapter.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapter)
        });
        if (!response.ok) throw new Error('Failed to update chapter');
        const data = await response.json();
        
        const index = this.chapters.findIndex(c => c.id === chapter.id);
        if (index !== -1) {
          this.chapters[index] = data;
        }
        // Sort chapters by chapter_number descending
        this.chapters.sort((a, b) => b.chapter_number - a.chapter_number);
        this.latestChapter = this.chapters[0];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteChapter(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/chapters/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete chapter');
        
        this.chapters = this.chapters.filter(c => c.id !== id);
        this.latestChapter = this.chapters.length > 0 ? this.chapters[0] : null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
