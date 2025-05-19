<script lang="ts">
import { enhance as svelteKitEnhance } from '$app/forms';
import type { PageData } from './$types';
import { superForm } from 'sveltekit-superforms';
import { onMount } from 'svelte';
import { user, isAuthenticated } from '$stores/auth';

const spinner = '/bouncing-ball.svg'


import '$styles/form.css'

let response_srvr = '';
let auth = false;
let userData = {
    userName: '',
    email:'',
    role:'',
  };
  isAuthenticated.subscribe(a => auth = a)
  user.subscribe(u => userData = u)

export let data: PageData;
const { form, errors, enhance, delayed } = superForm(data.form, {
    onUpdate({ result }) {
      // result.data contains the extra data returned from the action.
      const actionData = result.data as { user?: { userName: string; email: string; role: string }, message?: string };
      if (actionData?.message) {
        response_srvr = actionData.message
      }
      if (actionData?.user) {
        user.set(actionData.user);
        isAuthenticated.set(true);
        response_srvr = '';
      }
      
    }
  });
</script>

<div>
  {#if auth }
    <div class="update-message">Přihlášení proběhlo úspěšně</div>
  {/if}
  {#if response_srvr}
    <div class="global-error">{response_srvr}</div>
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

        
        {#if $delayed}
          <img src={spinner} alt="loading spinner" class="spinner" />
        {:else}
          <button type="submit" >Přihlásit se</button>
        {/if}
        
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

<style>
  .spinner {
    display: block;
    margin: 0 auto; /* centers the spinner horizontally */
    animation: sideToSide 1.5s ease-in-out infinite;
  }
  @keyframes sideToSide {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(20px); }
    100% { transform: translateX(0); }
  }

  .global-error {
  color: #b00020;
  background-color: #fff0f0;
  border: 1px solid #f8bbd0;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}
</style>
