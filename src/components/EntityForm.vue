<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <h2 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ isEditMode ? 'Editar' : 'Adicionar' }} {{ entityTypeName }}</h2>
    <form @submit.prevent="submitForm" class="flex flex-col flex-grow overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="mb-4 relative">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'heading']" class="text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            required
          />
        </div>
        <div class="mb-4 relative">
          <label for="concept" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Conceito:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-gray-400" />
          </div>
          <input
            type="text"
            id="concept"
            v-model="formData.concept"
            class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          />
        </div>
        <div class="mb-4 relative">
          <label for="archetype" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Arquétipo:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'mask']" class="text-gray-400" />
          </div>
          <input
            type="text"
            id="archetype"
            v-model="formData.archetype"
            class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          />
        </div>
        <div class="mb-4 relative">
          <label for="pontos" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pontos:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'star']" class="text-gray-400" />
          </div>
          <input
            type="number"
            id="pontos"
            v-model="formData.pontos"
            class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
          />
        </div>
      </div>

      <!-- Attributes -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'list-ol']" /><span>Atributos</span></h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4 relative">
            <label for="Poder" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Poder:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'hand-fist']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Poder"
              v-model="formData.Poder"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
          <div class="mb-4 relative">
            <label for="Habilidade" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Habilidade:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'brain']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Habilidade"
              v-model="formData.Habilidade"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
          <div class="mb-4 relative">
            <label for="Resistencia" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Resistência:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'shield-halved']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Resistencia"
              v-model="formData.Resistencia"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
        </div>
      </div>

      <!-- Life/Mana/Action Points -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'heart-pulse']" /><span>Pontos de Vida/Mana/Ação</span></h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4 relative">
            <label for="Pontos_Vida" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pontos de Vida:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'heart']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Pontos_Vida"
              v-model="formData.Pontos_Vida"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
          <div class="mb-4 relative">
            <label for="Pontos_Mana" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pontos de Mana:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Pontos_Mana"
              v-model="formData.Pontos_Mana"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
          <div class="mb-4 relative">
            <label for="Pontos_Acao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pontos de Ação:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'bolt']" class="text-gray-400" />
            </div>
            <input
              type="number"
              id="Pontos_Acao"
              v-model="formData.Pontos_Acao"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pl-10"
            />
          </div>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'image']" /><span>Imagem</span></h3>
        <ImageUpload :currentImageUrl="formData.image" @image-uploaded="handleImageUpload" />
      </div>

      <!-- Pericias -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'graduation-cap']" /><span>Perícias</span></h3>
        <div v-for="(pericia, index) in formData.pericias" :key="pericia._tempId || index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`pericia-id-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Perícia:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'scroll']" class="text-gray-400" />
            </div>
            <select
              :id="`pericia-id-${index}`"
              v-model="pericia.pericia_id"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-3"
            >
              <option :value="null" disabled>Selecione uma Perícia</option>
              <option v-for="p in periciasStore.pericias" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <button type="button" @click="removePericia(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addPericia" class="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Perícia</span>
        </button>
      </div>

      <!-- Vantagens -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'thumbs-up']" /><span>Vantagens</span></h3>
        <div v-for="(vantagem, index) in formData.vantagens" :key="vantagem._tempId || index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`vantagem-id-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Vantagem:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <font-awesome-icon :icon="['fas', 'scroll']" class="text-gray-400" />
            </div>
            <select
              :id="`vantagem-id-${index}`"
              v-model="vantagem.vantagem_id"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-3"
            >
              <option :value="null" disabled>Selecione uma Vantagem</option>
              <option v-for="v in vantagensStore.vantagens" :key="v.id" :value="v.id">{{ v.name }}</option>
            </select>
          </div>
          <button type="button" @click="removeVantagem(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addVantagem" class="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Vantagem</span>
        </button>
      </div>

      <!-- Desvantagens -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'thumbs-down']" /><span>Desvantagens</span></h3>
        <div v-for="(desvantagem, index) in formData.desvantagens" :key="desvantagem._tempId || index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`desvantagem-id-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Desvantagem:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              
            </div>
            <select
              :id="`desvantagem-id-${index}`"
              v-model="desvantagem.desvantagem_id"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-3"
            >
              <option :value="null" disabled>Selecione uma Desvantagem</option>
              <option v-for="d in desvantagensStore.desvantagens" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <button type="button" @click="removeDesvantagem(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addDesvantagem" class="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Desvantagem</span>
        </button>
      </div>

      <!-- Tecnicas -->
      <div class="mt-6 p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'hat-wizard']" /><span>Técnicas</span></h3>
        <div v-for="(tecnica, index) in formData.tecnicas" :key="tecnica._tempId || index" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end p-3 border rounded-lg bg-white dark:bg-slate-800">
          <div class="relative">
            <label :for="`tecnica-id-${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Técnica:</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              
            </div>
            <select
              :id="`tecnica-id-${index}`"
              v-model="tecnica.tecnica_id"
              class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white pl-3"
            >
              <option :value="null" disabled>Selecione uma Técnica</option>
              <option v-for="t in tecnicasStore.tecnicas" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <button type="button" @click="removeTecnica(index)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <span>Remover</span>
          </button>
        </div>
        <button type="button" @click="addTecnica" class="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Adicionar Técnica</span>
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
import { ref, watch, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { usePericiasStore } from '../stores/pericias';
import { useVantagensStore } from '../stores/vantagens';
import { useDesvantagensStore } from '../stores/desvantagens';
import { useTecnicasStore } from '../stores/tecnicas';
import ImageUpload from './ImageUpload.vue';

const props = defineProps({
  entity: {
    type: Object,
    default: null,
  },
  entityType: {
    type: String,
    required: true,
    validator: (value) => ['personagem', 'npc', 'monstro'].includes(value),
  },
  campaignId: {
    type: Number,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['save', 'close']);

const periciasStore = usePericiasStore();
const vantagensStore = useVantagensStore();
const desvantagensStore = useDesvantagensStore();
const tecnicasStore = useTecnicasStore();

const formData = ref({
  name: '',
  concept: '',
  archetype: '',
  pontos: '',
  Habilidade: null,
  Poder: null,
  Resistencia: null,
  Pontos_Acao: null,
  Pontos_Mana: null,
  Pontos_Vida: null,
  image: '', // Changed from image_url to image
  pericias: [],
  vantagens: [],
  desvantagens: [],
  tecnicas: [],
});

const entityTypeName = computed(() => {
  switch (props.entityType) {
    case 'personagem':
      return 'Personagem';
    case 'npc':
      return 'NPC';
    case 'monstro':
      return 'Monstro';
    default:
      return 'Entidade';
  }
});

watch(() => props.entity, (newEntity) => {
  if (newEntity) {
    let pericias = [];
    let vantagens = [];
    let desvantagens = [];
    let tecnicas = [];

    if (props.entityType === 'personagem') {
      pericias = newEntity.pericias ? newEntity.pericias.map(p => ({ pericia_id: p.id || p.pericia_id, _tempId: uuidv4() })) : (newEntity.personagens_pericias ? newEntity.personagens_pericias.map(p => ({ pericia_id: p.pericia_id, _tempId: uuidv4() })) : []);
      vantagens = newEntity.vantagens ? newEntity.vantagens.map(v => ({ vantagem_id: v.id || v.vantagem_id, _tempId: uuidv4() })) : (newEntity.personagens_vantagens ? newEntity.personagens_vantagens.map(v => ({ vantagem_id: v.vantagem_id, _tempId: uuidv4() })) : []);
      desvantagens = newEntity.desvantagens ? newEntity.desvantagens.map(d => ({ desvantagem_id: d.id || d.desvantagem_id, _tempId: uuidv4() })) : (newEntity.personagens_desvantagens ? newEntity.personagens_desvantagens.map(d => ({ desvantagem_id: d.desvantagem_id, _tempId: uuidv4() })) : []);
      tecnicas = newEntity.tecnicas ? newEntity.tecnicas.map(t => ({ tecnica_id: t.id || t.tecnica_id, _tempId: uuidv4() })) : (newEntity.personagens_tecnicas ? newEntity.personagens_tecnicas.map(t => ({ tecnica_id: t.tecnica_id, _tempId: uuidv4() })) : []);
    } else if (props.entityType === 'npc') {
      pericias = newEntity.pericias ? newEntity.pericias.map(p => ({ pericia_id: p.id || p.pericia_id, _tempId: uuidv4() })) : (newEntity.npcs_pericias ? newEntity.npcs_pericias.map(p => ({ pericia_id: p.pericia_id, _tempId: uuidv4() })) : []);
      vantagens = newEntity.vantagens ? newEntity.vantagens.map(v => ({ vantagem_id: v.id || v.vantagem_id, _tempId: uuidv4() })) : (newEntity.npcs_vantagens ? newEntity.npcs_vantagens.map(v => ({ vantagem_id: v.vantagem_id, _tempId: uuidv4() })) : []);
      desvantagens = newEntity.desvantagens ? newEntity.desvantagens.map(d => ({ desvantagem_id: d.id || d.desvantagem_id, _tempId: uuidv4() })) : (newEntity.npcs_desvantagens ? newEntity.npcs_desvantagens.map(d => ({ desvantagem_id: d.desvantagem_id, _tempId: uuidv4() })) : []);
      tecnicas = newEntity.tecnicas ? newEntity.tecnicas.map(t => ({ tecnica_id: t.id || t.tecnica_id, _tempId: uuidv4() })) : (newEntity.npcs_tecnicas ? newEntity.npcs_tecnicas.map(t => ({ tecnica_id: t.tecnica_id, _tempId: uuidv4() })) : []);
    } else if (props.entityType === 'monstro') {
      pericias = newEntity.pericias ? newEntity.pericias.map(p => ({ pericia_id: p.id || p.pericia_id, _tempId: uuidv4() })) : (newEntity.monstros_pericias ? newEntity.monstros_pericias.map(p => ({ pericia_id: p.pericia_id, _tempId: uuidv4() })) : []);
      vantagens = newEntity.vantagens ? newEntity.vantagens.map(v => ({ vantagem_id: v.id || v.vantagem_id, _tempId: uuidv4() })) : (newEntity.monstros_vantagens ? newEntity.monstros_vantagens.map(v => ({ vantagem_id: v.vantagem_id, _tempId: uuidv4() })) : []);
      desvantagens = newEntity.desvantagens ? newEntity.desvantagens.map(d => ({ desvantagem_id: d.id || d.desvantagem_id, _tempId: uuidv4() })) : (newEntity.monstros_desvantagens ? newEntity.monstros_desvantagens.map(d => ({ desvantagem_id: d.desvantagem_id, _tempId: uuidv4() })) : []);
      tecnicas = newEntity.tecnicas ? newEntity.tecnicas.map(t => ({ tecnica_id: t.id || t.tecnica_id, _tempId: uuidv4() })) : (newEntity.monstros_tecnicas ? newEntity.monstros_tecnicas.map(t => ({ tecnica_id: t.tecnica_id, _tempId: uuidv4() })) : []);
    }

    formData.value = {
      ...newEntity,
      pericias: pericias,
      vantagens: vantagens,
      desvantagens: desvantagens,
      tecnicas: tecnicas,
    };
  } else {
    // Reset form for new entity creation
    formData.value = {
      name: '',
      concept: '',
      archetype: '',
      pontos: '',
      Habilidade: null,
      Poder: null,
      Resistencia: null,
      Pontos_Acao: null,
      Pontos_Mana: null,
      Pontos_Vida: null,
      image: '',
      pericias: [],
      vantagens: [],
      desvantagens: [],
      tecnicas: [],
    };
  }
}, { immediate: true });

const handleImageUpload = (url) => {
  formData.value.image = url;
};

const addPericia = () => {
  formData.value.pericias.push({ pericia_id: null, _tempId: uuidv4() });
};
const removePericia = (index) => {
  formData.value.pericias.splice(index, 1);
};

const addVantagem = () => {
  formData.value.vantagens.push({ vantagem_id: null, _tempId: uuidv4() });
};
const removeVantagem = (index) => {
  formData.value.vantagens.splice(index, 1);
};

const addDesvantagem = () => {
  formData.value.desvantagens.push({ desvantagem_id: null, _tempId: uuidv4() });
};
const removeDesvantagem = (index) => {
  formData.value.desvantagens.splice(index, 1);
};

const addTecnica = () => {
  formData.value.tecnicas.push({ tecnica_id: null, _tempId: uuidv4() });
};
const removeTecnica = (index) => {
  formData.value.tecnicas.splice(index, 1);
};

const submitForm = () => {
  const dataToSave = { ...formData.value, campaign_id: props.campaignId };

  // Filter out relations with null IDs before saving
  dataToSave.pericias = dataToSave.pericias.filter(p => p.pericia_id !== null && p.pericia_id !== undefined);
  dataToSave.vantagens = dataToSave.vantagens.filter(v => v.vantagem_id !== null && v.vantagem_id !== undefined);
  dataToSave.desvantagens = dataToSave.desvantagens.filter(d => d.desvantagem_id !== null && d.desvantagem_id !== undefined);
  dataToSave.tecnicas = dataToSave.tecnicas.filter(t => t.tecnica_id !== null && t.tecnica_id !== undefined);

  console.log('Data to save - Pericias:', JSON.parse(JSON.stringify(dataToSave.pericias)));
  console.log('Data to save - Vantagens:', JSON.parse(JSON.stringify(dataToSave.vantagens)));
  console.log('Data to save - Desvantagens:', JSON.parse(JSON.stringify(dataToSave.desvantagens)));
  console.log('Data to save - Tecnicas:', JSON.parse(JSON.stringify(dataToSave.tecnicas)));
  emit('save', dataToSave);
};

onMounted(async () => {
  await periciasStore.fetchPericias();
  await vantagensStore.fetchVantagens();
  await desvantagensStore.fetchDesvantagens();
  await tecnicasStore.fetchTecnicas();
});
</script>
