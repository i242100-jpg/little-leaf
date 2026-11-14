import test from 'node:test';
import assert from 'node:assert/strict';
import { applyStockChanges, recordPurchase } from '../src/utils/inventory.js';
const plants = [{ id: 'calathea', stock: 3 }, { id: 'pothos', stock: 12 }];
test('buying all three makes Calathea sold out', () => {
  const sold = recordPurchase({}, [{ id: 'calathea', quantity: 3 }], plants);
  assert.equal(applyStockChanges(plants, sold)[0].stock, 0);
});
test('multiple purchases add up', () => {
  const sold = recordPurchase({ pothos: 2 }, [{ id: 'pothos', quantity: 4 }], plants);
  assert.equal(applyStockChanges(plants, sold)[1].stock, 6);
});
test('stock cannot be negative', () => {
  assert.equal(applyStockChanges(plants, { calathea: 99 })[0].stock, 0);
});
test('resetting inventory restores original stock', () => {
  assert.equal(applyStockChanges(plants, {})[0].stock, 3);
});
