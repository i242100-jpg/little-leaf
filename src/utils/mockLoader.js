import { plants } from '../data/plants';

export function loadPlants({ fail = false, empty = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('The greenhouse is having trouble loading.'));
      else resolve(empty ? [] : plants);
    }, 450);
  });
}
