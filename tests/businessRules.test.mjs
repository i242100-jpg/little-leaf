import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuantity, getDeliveryFee, checkPetCompatibility } from '../src/utils/businessRules.js';
test('valid quantity', () => assert.equal(validateQuantity(2, 10).ok, true));
test('quantity exactly at six limit', () => assert.equal(validateQuantity(6, 10).ok, true));
test('quantity above six blocked', () => assert.equal(validateQuantity(7, 10).ok, false));
test('quantity above available stock blocked', () => assert.equal(validateQuantity(4, 3).ok, false));
test('only supported delivery cities', () => { assert.equal(getDeliveryFee('Islamabad'), 200); assert.equal(getDeliveryFee('Karachi'), null); });
test('pet restriction applies', () => assert.equal(checkPetCompatibility([{ id: 'aloe' }], [{ id: 'aloe', name: 'Aloe', petSafe: false }], true).ok, false));
