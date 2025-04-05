<script lang="ts">
import { enhance as svelteKitEnhance } from '$app/forms';
import type { PageData } from './$types';
import { superForm } from 'sveltekit-superforms';
import { onMount } from 'svelte';
import { user, isAuthenticated } from '../../../stores/auth';

import '../../../styles/form.css'

let auth = false;
let userData = {
    userName: '',
    email:'',
     role:'',
  };
  isAuthenticated.subscribe(a => auth = a)
  user.subscribe(u => userData = u)

export let data: PageData;
const { form, errors, message, enhance } = superForm(data.form, {
    onUpdate({ result }) {
      // result.data contains the extra data returned from the action.
      const actionData = result.data as { user?: { userName: string; email: string; role: string }, message?: string };
      console.log('Action data:', actionData);
      if (actionData?.user) {
        user.set(actionData.user);
        isAuthenticated.set(true);
      }
    }
  });
</script>

<div>
  {#if auth }
    <div class="update-message">Přihlášení proběhlo úspěšně</div>
  {/if}

  {#if !auth}
    <form use:enhance method="post" class="form-container">
        <h2>Přihlásení</h2>
        <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového účtu.</p>
        
        <div class="form-group">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            bind:value={$form.email} 
            class="form-control" 
            placeholder="vložte email"
        />
        {#if $errors.email}
            <div class="error-message">{$errors.email}</div>
        {/if}
        </div>
        <div class="form-group">
        <label for="password">Heslo</label>
        <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            bind:value={$form.password} 
            class="form-control" 
            placeholder="vložte heslo"
        />
        {#if $errors.password}
            <div class="error-message">{$errors.password}</div>
        {/if}
        </div>
        <button type="submit" class="btn-submit">Přihlásit se</button>
    </form>
    {:else}
    <div class="logged-in-message">
        <span class="icon">✅</span>
        <span>
          Jste již přihlášeni jako <strong>{$user.userName}</strong>
        </span>
      </div>

    {/if}

</div>
