// These functions power the UI and Node tests.
export const MAX_PER_PLANT = 6;
export const DELIVERY_FEES = { Islamabad: 200, Rawalpindi: 250 };
export function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, message: 'Choose at least one plant.' };
  if (quantity > MAX_PER_PLANT) return { ok: false, message: `Maximum ${MAX_PER_PLANT} of each plant per order.` };
  if (quantity > stock) return { ok: false, message: `Only ${stock} plants available.` };
  return { ok: true, message: '' };
}
export function checkPetCompatibility(items, plants, hasPets) {
  if (!hasPets) return { ok: true, message: '' };
  const unsafe = items.map(item => plants.find(p => p.id === item.id)).filter(p => p && !p.petSafe);
  return unsafe.length ? { ok: false, message: `Not marked pet-safe: ${unsafe.map(p => p.name).join(', ')}. Remove these plants or review your pet-safety choice.` } : { ok: true, message: '' };
}
export function getDeliveryFee(city) { return DELIVERY_FEES[city] ?? null; }
export function calculateSummary(items, plants, city, pots = {}) {
  const subtotal = items.reduce((sum, item) => {
    const plant = plants.find(p => p.id === item.id);
    return sum + (plant ? (plant.price + (pots[item.id] === 'ceramic' ? 350 : 0)) * item.quantity : 0);
  }, 0);
  const delivery = getDeliveryFee(city) ?? 0;
  return { subtotal, delivery, total: subtotal + delivery, count: items.reduce((n, i) => n + i.quantity, 0) };
}
