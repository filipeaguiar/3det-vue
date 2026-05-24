<template>
  <div class="font-sans antialiased bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 min-h-screen">
    <div :class="[route.path === '/auth' ? 'w-full h-full' : 'container relative mx-auto p-4 sm:p-6 md:p-8']">
      <header v-if="route.path !== '/auth'" class="relative text-center mb-8 border-b-4 border-amber-500 pb-4">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-wider text-slate-800 dark:text-slate-100" style="font-family: 'Bangers', cursive;">Escudo do Mestre Digital</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 uppercase tracking-widest mt-1">3DeT Victory</p>
        <div class="absolute top-0 right-0 mt-2 mr-2">
          <router-link v-if="!user" to="/auth" class="flex items-center justify-center p-2 rounded-full shadow-sm transition-all duration-300 ease-in-out bg-amber-500 text-white hover:bg-amber-600">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
          </router-link>
          <button v-else @click="handleSignOut" :disabled="loading" class="flex items-center justify-center p-2 rounded-full shadow-sm transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          </button>
        </div>
      </header>

      <nav v-if="route.path !== '/auth'" class="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        <router-link to="/" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'dice-d6']" />
          <span class="hidden sm:inline">Testes</span>
        </router-link>
        <router-link to="/combate" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/combate') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'hand-fist']" />
          <span class="hidden sm:inline">Combate</span>
        </router-link>
        <router-link to="/manobras" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/manobras') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'person-running']" />
          <span class="hidden sm:inline">Manobras</span>
        </router-link>
        <router-link to="/regras" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/regras') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'book']" />
          <span class="hidden sm:inline">Regras</span>
        </router-link>
        <router-link to="/mestrando" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/mestrando') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'hat-wizard']" />
          <span class="hidden sm:inline">Mestrando</span>
        </router-link>
        <router-link to="/personagens" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/personagens') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'users']" />
          <span class="hidden sm:inline">Personagens</span>
        </router-link>
        <router-link to="/npcs" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/npcs') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'address-book']" />
          <span class="hidden sm:inline">NPCs</span>
        </router-link>
        <router-link to="/bestiario" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/bestiario') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'dragon']" />
          <span class="hidden sm:inline">Bestiário</span>
        </router-link>
        <router-link to="/sessoes" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/sessoes') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'scroll']" />
          <span class="hidden sm:inline">Sessão Atual</span>
        </router-link>
        <router-link to="/campanha" class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out" :class="isActive('/campanha') ? 'bg-amber-500 text-white font-semibold dark:text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800'">
          <font-awesome-icon :icon="['fas', 'book-open']" />
          <span class="hidden sm:inline">Campanha</span>
        </router-link>
      </nav>
      
      <main id="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCampaignsStore } from './stores/campaigns';
import { storeToRefs } from 'pinia';

const route = useRoute();
const isActive = (path) => route.path === path;

const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);

const campaignsStore = useCampaignsStore();

const handleSignOut = async () => {
  await authStore.signOut();
};

onMounted(async () => {
  await authStore.fetchUser(); // Fetch initial user session
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
</style>
