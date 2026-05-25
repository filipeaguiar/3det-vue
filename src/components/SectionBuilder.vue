<template>
  <div class="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700">
    <h3 class="text-lg font-bold mb-3 flex items-center gap-x-2">
      <font-awesome-icon :icon="['fas', icon]" />
      <span>{{ title }}</span>
    </h3>
    <div v-for="(item, index) in items" :key="item._tempId || index" class="space-y-2 mb-3 p-3 border rounded-lg bg-white dark:bg-slate-800 relative">
      <slot name="item" :item="item" :index="index"></slot>
      <button @click="$emit('remove', index)" class="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors">
        <font-awesome-icon :icon="['fas', 'times-circle']" />
      </button>
    </div>
    <button @click="$emit('add')" class="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-x-2">
      <font-awesome-icon :icon="['fas', 'plus-circle']" />
      <span>Adicionar {{ title.slice(0,-1) }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String,
  items: Array,
});
defineEmits(['add', 'remove']);
</script>
