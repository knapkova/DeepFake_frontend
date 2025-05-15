import { writable, type Writable } from 'svelte/store';


function persisted<T>(key: string, init: T): Writable<T> {
    let initial: T;
    try {
      const raw = localStorage.getItem(key);
      initial = raw ? JSON.parse(raw) as T : init;
    } catch {
      initial = init;
    }
    const store = writable<T>(initial);
    store.subscribe((v) => {
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        /* ignore */
      }
    });
    return store;
  }


export const nickname = persisted<string>('nickname', '');
export const state_game = persisted<1 | 2 | 3 | 4 | 5 | 6 | 7 >('state_game', 1);
export const progress = persisted<number>('progress', 100);
