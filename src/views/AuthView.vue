<template>
  <div class="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
    <!-- Imagem de Fundo (Hero) -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-hero scale-105 transition-transform duration-1000"></div>
    
    <!-- Overlay Escuro/Claro para melhorar o contraste geral -->
    <div class="absolute inset-0 bg-slate-200/30 dark:bg-slate-950/60 mix-blend-overlay"></div>

    <!-- Container Glassmorphism -->
    <div class="relative z-10 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border border-white/40 dark:border-slate-700/50 transition-all">
      
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-amber-600 dark:text-amber-500 drop-shadow-sm tracking-wide" style="font-family: 'Bangers', cursive;">3DeT Victory</h1>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest mt-2">Escudo do Mestre</p>
      </div>

      <form @submit.prevent="handleLogin" v-if="isLogin" class="space-y-6">
        <div class="relative">
          <label for="email-login" class="block text-slate-800 dark:text-slate-200 text-sm font-bold mb-2">Email:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="email"
            id="email-login"
            v-model="email"
            class="w-full py-2.5 pl-10 pr-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
            placeholder="heroi@megacity.com"
            required
          />
        </div>
        
        <div class="relative">
          <label for="password-login" class="block text-slate-800 dark:text-slate-200 text-sm font-bold mb-2">Senha:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
            <font-awesome-icon :icon="['fas', 'lock']" class="text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="password"
            id="password-login"
            v-model="password"
            class="w-full py-2.5 pl-10 pr-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="flex flex-col gap-4 mt-8">
          <button
            type="submit"
            class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
            <span>Entrar no Sistema</span>
          </button>
          
          <div class="text-center">
            <a href="#" @click.prevent="isLogin = false" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Novo recruta? Registre-se aqui
            </a>
          </div>
        </div>
      </form>

      <form @submit.prevent="handleRegister" v-else class="space-y-6">
        <div class="relative">
          <label for="email-register" class="block text-slate-800 dark:text-slate-200 text-sm font-bold mb-2">Email:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="email"
            id="email-register"
            v-model="email"
            class="w-full py-2.5 pl-10 pr-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
            placeholder="heroi@megacity.com"
            required
          />
        </div>
        
        <div class="relative">
          <label for="password-register" class="block text-slate-800 dark:text-slate-200 text-sm font-bold mb-2">Senha:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
            <font-awesome-icon :icon="['fas', 'lock']" class="text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="password"
            id="password-register"
            v-model="password"
            class="w-full py-2.5 pl-10 pr-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="flex flex-col gap-4 mt-8">
          <button
            type="submit"
            class="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'user-plus']" />
            <span>Criar Credencial</span>
          </button>
          
          <div class="text-center">
            <a href="#" @click.prevent="isLogin = true" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Já possui credencial? Voltar
            </a>
          </div>
        </div>
      </form>
      
      <div v-if="message" class="mt-6 p-3 rounded-lg text-center text-sm font-medium backdrop-blur-sm" :class="messageType === 'error' ? 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const message = ref('');
const messageType = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro no login');
    
    authStore.setUser(data.user);
    message.value = 'Login bem-sucedido!';
    messageType.value = 'success';
    router.push('/');
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
};

const handleRegister = async () => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro no registro');
    
    message.value = 'Registro bem-sucedido! Agora você pode fazer login.';
    messageType.value = 'success';
    isLogin.value = true;
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
};
</script>

<style scoped>
.bg-hero {
  background-image: url('@/assets/hero-login.png');
}
</style>
