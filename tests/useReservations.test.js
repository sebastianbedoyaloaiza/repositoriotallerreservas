import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
 
// Simulación de localStorage antes de cada test
beforeEach(() => {
  const store = {};
  global.localStorage = {
    getItem: vi.fn((k) => (k in store ? store[k] : "[]")),
    setItem: vi.fn((k, v) => { store[k] = v; }),
    removeItem: vi.fn((k) => { delete store[k]; }),
    clear: vi.fn(() => { for (const k in store) delete store[k]; })
  };
  // Freeze system time so date comparisons are deterministic
  vi.useFakeTimers();
  // Set "now" to a moment before the reservation in the test
  vi.setSystemTime(new Date("2025-10-20T12:00:00"));
  vi.resetModules(); // Limpia imports previos
});
 
afterEach(() => {
  vi.useRealTimers();
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
      nombre: "Sebastian",
      espacioId: "aula-101",
      fecha: "2025-10-21",
      hora: "15:00",
    };
 
    // check return value and state
    const ok = add(reserva);
    expect(ok).toBe(true);
    expect(reservas.value.length).toBe(1);
    expect(reservas.value[0]).toMatchObject(reserva);
 
    // Eliminar la reserva
    removeById(reserva.id);
    expect(reservas.value.length).toBe(0);
  });
});
 