<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <h2 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ session?.id ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
    <form @submit.prevent="submitForm" class="flex flex-col flex-grow overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="mb-4 relative">
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'heading']" class="text-gray-400" />
          </div>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            required
          />
        </div>

        <div class="mb-4 relative">
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'align-left']" class="text-gray-400" />
          </div>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          ></textarea>
        </div>

        <div class="mb-4 relative">
          <label for="comeco_forte" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Começo Forte</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'bolt']" class="text-gray-400" />
          </div>
          <textarea
            id="comeco_forte"
            v-model="formData.comeco_forte"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          ></textarea>
        </div>

        <div class="mb-4 relative">
          <label for="gancho_proxima_aventura" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gancho Próxima Aventura</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-gray-400" />
          </div>
          <textarea
            id="gancho_proxima_aventura"
            v-model="formData.gancho_proxima_aventura"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          ></textarea>
        </div>
      </div>

      <!-- Objetivos -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'bullseye']" /><span>Objetivos</span></h3>
        <div v-for="(objetivo, index) in formData.objetivos" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`objetivo-type-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'tag']" class="text-gray-400" />
            </div>
            <input type="text" :id="`objetivo-type-${index}`" v-model="objetivo.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <div class="md:col-span-2 relative">
            <label :for="`objetivo-description-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'align-left']" class="text-gray-400" />
            </div>
            <textarea :id="`objetivo-description-${index}`" v-model="objetivo.description" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
          </div>
          <button type="button" @click="removeObjetivo(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addObjetivo" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Objetivo</span>
        </button>
      </div>

      <!-- Ganchos de Personagens -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-tag']" /><span>Ganchos de Personagens</span></h3>
        <div v-for="(gancho, index) in formData.ganchos_personagens" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`gancho-personagem-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Personagem:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400" />
            </div>
            <input type="text" :id="`gancho-personagem-${index}`" v-model="gancho.personagem_name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <div class="md:col-span-2 relative">
            <label :for="`gancho-description-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'align-left']" class="text-gray-400" />
            </div>
            <textarea :id="`gancho-description-${index}`" v-model="gancho.description" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
          </div>
          <button type="button" @click="removeGancho(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addGancho" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Gancho</span>
        </button>
      </div>

      <!-- Locais Interessantes -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'map-marker-alt']" /><span>Locais Interessantes</span></h3>
        <div v-for="(local, localIndex) in formData.locais_interessantes" :key="localIndex" class="mb-4 p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="flex justify-between items-center mb-2 relative">
            <label :for="`local-name-${localIndex}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Local:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'map-pin']" class="text-gray-400" />
            </div>
            <input type="text" :id="`local-name-${localIndex}`" v-model="local.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
            <button type="button" @click="removeLocal(localIndex)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm flex items-center justify-center gap-x-1">
              <font-awesome-icon :icon="['fas', 'trash']" />
              <span>Remover Local</span>
            </button>
          </div>
          <h4 class="text-md font-semibold mb-2 text-slate-700 dark:text-slate-200">Características:</h4>
          <div v-for="(carac, caracIndex) in local.caracteristicas" :key="caracIndex" class="flex gap-4 mb-2 items-end relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-400" />
            </div>
            <textarea :id="`carac-description-${localIndex}-${caracIndex}`" v-model="carac.description" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
            <button type="button" @click="removeCaracteristica(localIndex, caracIndex)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
              <font-awesome-icon :icon="['fas', 'trash']" />
              <span>Remover</span>
            </button>
          </div>
          <button type="button" @click="addCaracteristica(localIndex)" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span>Adicionar Característica</span>
          </button>
        </div>
        <button type="button" @click="addLocal" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Local</span>
        </button>
      </div>

      <!-- NPCs Importantes -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-friends']" /><span>NPCs Importantes</span></h3>
        <div v-for="(npc, index) in formData.npcs_importantes" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`npc-id-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID do NPC:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'id-badge']" class="text-gray-400" />
            </div>
            <input type="number" :id="`npc-id-${index}`" v-model="npc.npc_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <button type="button" @click="removeNpc(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addNpc" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar NPC</span>
        </button>
      </div>

      <!-- Encontros e Desafios -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'dragon']" /><span>Encontros e Desafios</span></h3>
        <div v-for="(encontro, index) in formData.encontros_desafios" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`encontro-title-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'heading']" class="text-gray-400" />
            </div>
            <input type="text" :id="`encontro-title-${index}`" v-model="encontro.title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <div class="relative">
            <label :for="`encontro-description-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'align-left']" class="text-gray-400" />
            </div>
            <textarea :id="`encontro-description-${index}`" v-model="encontro.description" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
          </div>
          <div class="relative">
            <label :for="`encontro-mecanica-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mecânica:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'cogs']" class="text-gray-400" />
            </div>
            <input type="text" :id="`encontro-mecanica-${index}`" v-model="encontro.mecanica" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <button type="button" @click="removeEncontro(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addEncontro" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Encontro</span>
        </button>
      </div>

      <!-- Segredos e Rumores -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'mask']" /><span>Segredos e Rumores</span></h3>
        <div v-for="(segredo, index) in formData.segredos_rumores" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`segredo-description-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'align-left']" class="text-gray-400" />
            </div>
            <textarea :id="`segredo-description-${index}`" v-model="segredo.description" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
          </div>
          <button type="button" @click="removeSegredo(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addSegredo" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Segredo</span>
        </button>
      </div>

      <!-- Tesouros e Recompensas -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'coins']" /><span>Tesouros e Recompensas</span></h3>
        <div v-for="(tesouro, index) in formData.tesouros_recompensas" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`tesouro-name-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'gem']" class="text-gray-400" />
            </div>
            <input type="text" :id="`tesouro-name-${index}`" v-model="tesouro.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10" />
          </div>
          <div class="md:col-span-2">
            <label :for="`tesouro-description-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Mecânica:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'scroll']" class="text-gray-400" />
            </div>
            <textarea :id="`tesouro-description-${index}`" v-model="tesouro.description_mecanica" rows="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-10"></textarea>
          </div>
          <button type="button" @click="removeTesouro(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addTesouro" class="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Tesouro</span>
        </button>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500 flex items-center gap-x-2"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2"
        >
          <font-awesome-icon :icon="['fas', 'save']" />
          <span>Salvar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  session: {
    type: Object,
    default: null,
  },
  campaignId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

const formData = ref({
  title: '',
  description: '',
  comeco_forte: '',
  gancho_proxima_aventura: '',
  objetivos: [],
  ganchos_personagens: [],
  locais_interessantes: [],
  npcs_importantes: [],
  encontros_desafios: [],
  segredos_rumores: [],
  tesouros_recompensas: [],
});

watch(() => props.session, (newSession) => {
  if (newSession) {
    formData.value = {
      ...newSession,
      objetivos: newSession.objetivos || [],
      ganchos_personagens: newSession.ganchos_personagens || [],
      locais_interessantes: newSession.locais_interessantes || [],
      npcs_importantes: newSession.npcs_importantes || [],
      encontros_desafios: newSession.encontros_desafios || [],
      segredos_rumores: newSession.segredos_rumores || [],
      tesouros_recompensas: newSession.tesouros_recompensas || [],
    };
  } else {
    // Reset form for new session creation
    formData.value = {
      title: '',
      description: '',
      comeco_forte: '',
      gancho_proxima_aventura: '',
      objetivos: [],
      ganchos_personagens: [],
      locais_interessantes: [],
      npcs_importantes: [],
      encontros_desafios: [],
      segredos_rumores: [],
      tesouros_recompensas: [],
    };
  }
}, { immediate: true });

const addObjetivo = () => {
  formData.value.objetivos.push({ type: '', description: '' });
};
const removeObjetivo = (index) => {
  formData.value.objetivos.splice(index, 1);
};

const addGancho = () => {
  formData.value.ganchos_personagens.push({ personagem_name: '', description: '' });
};
const removeGancho = (index) => {
  formData.value.ganchos_personagens.splice(index, 1);
};

const addLocal = () => {
  formData.value.locais_interessantes.push({ name: '', caracteristicas: [] });
};
const removeLocal = (index) => {
  formData.value.locais_interessantes.splice(index, 1);
};
const addCaracteristica = (localIndex) => {
  formData.value.locais_interessantes[localIndex].caracteristicas.push({ description: '' });
};
const removeCaracteristica = (localIndex, caracIndex) => {
  formData.value.locais_interessantes[localIndex].caracteristicas.splice(caracIndex, 1);
};

const addNpc = () => {
  formData.value.npcs_importantes.push({ npc_id: null });
};
const removeNpc = (index) => {
  formData.value.npcs_importantes.splice(index, 1);
};

const addEncontro = () => {
  formData.value.encontros_desafios.push({ title: '', description: '', mecanica: '' });
};
const removeEncontro = (index) => {
  formData.value.encontros_desafios.splice(index, 1);
};

const addSegredo = () => {
  formData.value.segredos_rumores.push({ description: '' });
};
const removeSegredo = (index) => {
  formData.value.segredos_rumores.splice(index, 1);
};

const addTesouro = () => {
  formData.value.tesouros_recompensas.push({ name: '', description_mecanica: '' });
};
const removeTesouro = (index) => {
  formData.value.tesouros_recompensas.splice(index, 1);
};

const submitForm = () => {
  emit('save', { ...formData.value, campaign_id: props.campaignId });
};
</script>
