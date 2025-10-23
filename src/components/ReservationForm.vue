<template>
  <form @submit.prevent="reservar" class="space-y-3">
    <div>
      <label class="block text-sm font-mono text-left text-sky-700">
        Ingrese su nombre
      </label>
      <input
        v-model="nombre"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 text-black-500"
        placeholder="Tu nombre aqui"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-left text-sky-700">
        Confirme el espacio o seleccionelo
      </label>
      <select
        v-model="espacioId"
        class="bg-sky-300 mt-1 block w-full rounded-md border-blue shadow-sm p-2 text-black"
      >
        <option value="">--- Seleccione ---</option>
        <option v-for="s in SPACES" :key="s.id" :value="s.id">
          {{ s.nombre }} ({{ s.capacidad }} personas)
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-mono text-left text-sky-700">
        Seleccione la Fecha de la Reserva
      </label>
      <input
        v-model="fecha"
        type="date"
        class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 text-gray-500"
      />
    </div>

    <div>
      <label class="block text-sm font-mono text-left text-sky-700">
        Seleccione la hora de la reserva
      </label>
      <input
        v-model="hora"
        type="time"
        class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 text-gray-500"
      />
    </div>

    <div>
      <button
        class="w-full py-2 rounded-lg bg-blue-900! hover:bg-green-700! flex justify-center items-center gap-1">
        Confirmar Reserva
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SPACES } from '../data/spaces'
import { useReservations } from '../composables/useReservations'
import { toast } from 'vue3-toastify' // opcional si lo usas

const props = defineProps({
  preselectedId: [String, Number, null]
})

// campos
const nombre = ref('')
const espacioId = ref(props.preselectedId ?? '')
const fecha = ref('')
const hora = ref('')

watch(() => props.preselectedId, (v) => {
  if (v) espacioId.value = v
})

const { add, isConflict } = useReservations()

function reservar() {
  if (!nombre.value || !espacioId.value || !fecha.value || !hora.value) {
    alert('Por favor completa todos los campos')
    return
  }

  const nueva = {
    id: Date.now(),
    nombre: nombre.value.trim(),
    espacioId: espacioId.value,
    fecha: fecha.value,
    hora: hora.value
  }

  if (isConflict(nueva)) {
    if (typeof toast === 'function') {
      toast.error('No puede hacerse la reserva')
    } else {
      alert('No puede hacerse la reserva')
    }
    return
  }

  // Llamada al composable 
  const ok = add(nueva)
  if (!ok) {
    if (typeof toast === 'function') {
      toast.error('No se pudo crear la reserva — conflicto detectado')
    } else {
      alert('No se pudo crear la reserva — conflicto detectado')
    }
    return
  }

  // éxito
  if (typeof toast === 'function') {
    toast.success('Reserva creada correctamente')
  } else {
    alert('Reserva creada correctamente')
  }

  // limpiar campos 
  nombre.value = ''
  fecha.value = ''
  hora.value = ''
}
</script>

<style scoped>
</style>
