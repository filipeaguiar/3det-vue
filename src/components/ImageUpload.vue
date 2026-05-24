<template>
  <div class="image-upload-container">
    <label class="block text-gray-300 text-sm font-bold mb-2">Imagem:</label>
    <div class="flex items-center space-x-4">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="hidden"
      />
      <button
        type="button"
        @click="fileInput.click()"
        :disabled="isUploading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {{ isUploading ? 'Enviando...' : 'Selecionar Imagem' }}
      </button>
      <span v-if="fileName" class="text-gray-400">{{ fileName }}</span>
      <span v-else class="text-gray-500">Nenhuma imagem selecionada</span>
    </div>
    <p v-if="error" class="text-red-500 text-xs italic mt-1">{{ error }}</p>
    <div v-if="previewUrl" class="mt-4">
      <img :src="previewUrl" alt="Pré-visualização da imagem" class="max-w-xs h-auto rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  currentImageUrl: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['image-uploaded', 'error']);

const fileInput = ref(null);
const fileName = ref('');
const previewUrl = ref(null);
const error = ref(null);
const isUploading = ref(false);

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      error.value = 'Por favor, selecione um arquivo de imagem válido.';
      fileName.value = '';
      previewUrl.value = null;
      emit('image-uploaded', null);
      emit('error', error.value);
      return;
    }
    
    error.value = null;
    fileName.value = file.name;
    // Show local preview immediately
    previewUrl.value = URL.createObjectURL(file);
    
    // Upload file
    isUploading.value = true;
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      
      if (!response.ok) {
        throw new Error('Falha no upload');
      }
      
      const data = await response.json();
      emit('image-uploaded', data.url);
    } catch (err) {
      error.value = 'Erro ao fazer upload da imagem.';
      console.error(err);
      emit('error', error.value);
    } finally {
      isUploading.value = false;
    }
  } else {
    fileName.value = '';
    previewUrl.value = null;
    emit('image-uploaded', null);
  }
};

const getImageUrl = (url) => {
  if (!url) return null;
  // If it's a Vercel Blob private URL, use our consolidated upload/proxy endpoint
  if (url.includes('blob.vercel-storage.com')) {
    return `/api/upload?url=${encodeURIComponent(url)}`;
  }
  return url;
};

watch(() => props.currentImageUrl, (newVal) => {
  if (typeof newVal === 'string' && newVal) {
    previewUrl.value = getImageUrl(newVal);
    fileName.value = newVal.split('/').pop() || 'imagem_atual'; 
  } else if (!newVal) {
    previewUrl.value = null;
    fileName.value = '';
  }
}, { immediate: true });

</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
