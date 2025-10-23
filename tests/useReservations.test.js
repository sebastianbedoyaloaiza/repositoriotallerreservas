import { describe, it, expect, beforeEach, vi } from "vitest";

// Simulación de localStorage antes de cada test
beforeEach(() => {
  const store = {};
  global.localStorage = {
    getItem: vi.fn((k) => (k in store ? store[k] : "[]")),
    setItem: vi.fn((k, v) => { store[k] = v; }),
    removeItem: vi.fn((k) => { delete store[k]; }),
    clear: vi.fn(() => { for (const k in store) delete store[k]; })
  };
  vi.resetModules(); // Limpia imports previos
});

describe("useReservations composable", () => {
  it("agrega y elimina una reserva correctamente", async () => {
    // Import dinámico después del mock
    const { useReservations } = await import("../src/composables/useReservations.js");
    const { reservas, add, removeById } = useReservations();

    // Estado inicial vacío
    expect(reservas.value).toEqual([]);

    // Agregar una reserva
    const reserva = {
      id: "aula-101-2025-10-18-15:00",
      nombre: "Lifeng",
      espacioId: "aula-101",
      fecha: "2025-10-18",
      hora: "15:00",
    };
    add(reserva);

    expect(reservas.value.length).toBe(1);
    expect(reservas.value[0]).toMatchObject(reserva);

    // Eliminar la reserva
    removeById(reserva.id);
    expect(reservas.value.length).toBe(0);
  });
});
