<template>
  <button
    @click="$emit('select', space)"
    class="w-full text-left bg-gray-800 border border-gray-700 rounded-xl p-3 hover:shadow transition"
  >
    <div class="flex items-center gap-3">
      <!-- Bloque de texto: puede reducirse (flex-1 + min-w-0) -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-3">
          <!-- Nombre: truncate para no empujar -->
          <h3 class="font-semibold text-yellow-600 truncate">{{ space.nombre }}</h3>

          <!-- Tag: inline-flex + whitespace-nowrap + flex-none -->
          <span
            class="inline-flex items-center px-2 py-1 rounded bg-gray-700 text-white text-xs whitespace-nowrap flex-none"
          >
            {{ space.tipo }}
          </span>
        </div>

        <p class="text-gray-300 mt-1 text-xs">Capacidad: {{ space.capacidad }} personas</p>
      </div>

      <!-- Imagen a la derecha pequeña y sin encoger -->
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="space.nombre"
        class="w-12 h-12 object-cover rounded-md ml-3 shrink-"
      />
      </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ space: Object })
defineEmits(['select'])

const imgSrc = computed(() => {
  try {
    return props.space?.image
      ? new URL(`../assets/spaces/${props.space.image}`, import.meta.url).href
      : null
  } catch (e) {
    return null
  }
})
</script>
