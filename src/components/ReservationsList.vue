<template>
  <div class="p-3 rounded-md flex-1">
    <h2 class="font-semibold text-lg mb-7 mt-4 text-blue-700">Reservas Ya Creadas</h2>
    <p v-if="reservas.length === 0" class="text-sm text-gray-600">
      Aún no hay reservas.
    </p>
  
    <ul v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <li
        v-for="r in reservas"
        :key="r.id"
        class="border rounded-xl p-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold">{{ nombreEspacio(r.espacioId) }}</p>
            <p class="text-sm text-gray-400">{{ r.fecha }} • {{ r.hora }}</p>
            <p class="text-sm">
              <span class="text-gray-300">Reservado por:</span> {{ r.nombre }}
            </p>
          </div>
          <button
            @click="cancelar(r.id)"
            class="text-xs px-2 py-1 rounded-lg border hover:bg-red-500 text-red-900 border-yellow-400">
            Cancelar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useReservations } from '../composables/useReservations'
import { SPACES } from '../data/spaces'
import { toast } from 'vue3-toastify'

const { reservas, removeById } = useReservations()
const nombreEspacio = id => SPACES.find(s => s.id === id)?.nombre ?? id

function cancelar (id) {
  removeById(id)
  toast.info('La Reserva Ha sido Cancelada')
}
</script>
