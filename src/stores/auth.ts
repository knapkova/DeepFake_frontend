import { writable } from 'svelte/store';

export interface User {
    userName: string;
    email: string;
    role: string;
  }
  
  export const user = writable<User>({ userName: '', email: '', role: '' });
  export const isAuthenticated = writable(false);
