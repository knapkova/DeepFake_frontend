<script lang="ts">
    import { enhance } from '$app/forms';
import type { PageData } from './$types';
import { superForm } from 'sveltekit-superforms';
import { onMount } from 'svelte';
import PasswordStrength from '../../../lib/PasswordStrength.svelte'
import '../../../styles/form.css'
import { goto } from '$app/navigation';

export let data: PageData;

interface ActionResult {
    redirectTo?: string;
    message?: string;
    [key: string]: any;
  }

const { form, errors, message } = superForm(data.form);

</script>


    <div>
        {#if $message}
        <div class="update-message">{$message} Nyní se můžete přihlásit <a href="/account/login">zde</a></div>
        {/if}

        <form use:enhance method="post" class="form-container">
            <h2>Registrace</h2>
            <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového účtu.</p>
            <div class="form-group">
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    bind:value={$form.username} 
                    class="form-control" 
                    placeholder="vložte uživatelské jméno"
                    />
                {#if $errors.username}
                <div class="error-message">{$errors.username}</div>
                {/if}
            </div>
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
            <PasswordStrength password={$form.password} />
            <div class="form-group">
                <label for="repeatedPassword">Heslo znovu</label>
                <input 
                    type="password" 
                    id="repeatedPassword" 
                    name="repeatedPassword" 
                    required 
                    bind:value={$form.repeatedPassword} 
                    class="form-control" 
                    placeholder="potvrďte heslo"
                    />
                {#if $errors.repeatedPassword}
                <div class="error-message">{$errors.repeatedPassword}</div>
                {/if}
                <button type="submit">Registrovat se</button>
        </form>
    </div>



