// Simulated inventory lives in this browser only; no real stock is changed.
const KEY = 'littleLeafInventorySold-v1';
export function readSavedInventory() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id, n]) =>
      typeof id === 'string' && Number.isSafeInteger(n) && n >= 0));
  } catch { return {}; }
}
export function applyStockChanges(plants, sold = {}) {
  return plants.map(plant => ({ ...plant, stock: Math.max(0, plant.stock - (sold[plant.id] || 0)) }));
}
export function recordPurchase(sold, cart, originalPlants) {
  const next = { ...sold };
  for (const item of cart) {
    const plant = originalPlants.find(p => p.id === item.id);
    if (!plant || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) continue;
    next[item.id] = Math.min(plant.stock, (next[item.id] || 0) + item.quantity);
  }
  return next;
}
