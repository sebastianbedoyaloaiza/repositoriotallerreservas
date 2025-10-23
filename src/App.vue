<template>
  <div class="min-h-screen p-6 flex flex-col items-center">
    <!-- Título principal -->
    <h1 class="text-3xl font-mono mb-10 text-center text-yellow-500 ">
      SISTEMA PARA LA RESERVA DE ESPACIOS UNIVERSITARIOS 
    </h1>

    <!-- Contenedor centrado -->
    <div class="w-full max-w-2xl flex flex-col gap-6">
      <!-- Bloque 1: Espacios + filtro -->
      <section>
        <div class="flex flex-col gap-3 mb-3">
          <!-- Título -->
          <div class="border border-gray-700 p-7 rounded-md text-center">
            <h2 class="text-lg font-semibold text-blue-600">
              Seleccione un espacio para continuar
            </h2>
          </div>

          <!--Aqui está el Filtro -->
          <div class="p-3 rounded-md flex flex-col sm:flex-row justify-center items-center gap-2">
            <label class="text-sm text-gray-300">Filtrar por tipo:</label>
            <select
              v-model="filtroTipo"
              class="bg-sky-300 border rounded-lg p-1 text-sm text-gray-200"
            >
              <option value="">Todos</option>
              <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <SpaceCard
            v-for="s in filteredSpaces"
            :key="s.id"
            :space="s"
            @select="(sp) => (selectedId = sp.id)"
          />
        </div>
      </section>

      <!-- Bloque 2: Formulario -->
      <section>
        <div class="rounded-2xl border border-blue-600 p-4">
          <h2 class="text-lg font-semibold text-blue-600 mb-2 text-center">
            Crear Reserva
          </h2>
          <ReservationForm :preselected-id="selectedId" />
        </div>
      </section>

      <!-- Bloque 3: Lista de reservas -->
      <section>
        <ReservationsList />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SPACES as spaces } from './data/spaces'
import SpaceCard from './components/SpaceCard.vue'
import ReservationForm from './components/ReservationForm.vue'
import ReservationsList from './components/ReservationsList.vue'

const selectedId = ref(spaces[0]?.id ?? null)

//Esta es la l+ogica del filtro por tipo
const filtroTipo = ref('')
const tipos = [...new Set(spaces.map(s => s.tipo))]

const filteredSpaces = computed(() =>
  filtroTipo.value ? spaces.filter(s => s.tipo === filtroTipo.value) : spaces
)
</script>
