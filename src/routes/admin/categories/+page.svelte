<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '../../../styles/admin.css';
    import type { Category } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
  
    let updateMessage: string = '';
  
    // API endpoints – adjust these as needed.
    const request_get = '/api/Admin/Categories/GetCategories';
    const request_update = '/api/Admin/Categories/Update'; 
    const request_delete = '/api/Admin/Categories/Delete';
  
    // We'll store categories in a writable store.
    let categories = writable<Category[]>([]);
  
    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
      const data = await response.json();
      categories.set(data);
      console.log(data);
    });
  
    // Called when a user clicks "Save" for a row.
    async function updateCategory(category: Category, imageFile: File) {
        const formData = new FormData();
        formData.append('id', category.id.toString());
        formData.append('name', category.name);
        formData.append('description', category.description);
        formData.append('duration', category.duration.toString());
        formData.append('visible', category.visible.toString());
        formData.append('imgSrc', category.imgSrc);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_update}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            updateMessage = `Category ${category.id} updated successfully!`;
        } else {
            updateMessage = `Failed to update category ${category.id}.`;
            console.error('Update failed', response);
        }
    }

  
    // Delete function (unchanged from before)
    async function deleteCategory(id: number) {
      const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_delete}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        categories.update(cats => cats.filter(cat => cat.id !== id));
      } else {
        console.error('Failed to delete category');
      }
    }
  
    // For adding a new category (redirect)
    function navigate() {
      window.location.href = "/admin/categories/addNew";
    }
  </script>
  
  <h2>Úprava kategorií</h2>
  
  {#if updateMessage}
    <div class="update-message">{updateMessage}</div>
  {/if}
  
  <button on:click={navigate}>+ Přidat nové</button>
  <div class="admin-section">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Název</th>
          <th>Popis</th>
          <th>Délka</th>
          <th>Zobrazit</th>
          <th>Úvodní obrázek</th>
          <th>Akce</th>
        </tr>
      </thead>
      <tbody>
        {#each $categories as category (category.id)}
          <tr>
            <td>{category.id}</td>
            <td>
              <input
                type="text"
                bind:value={category.name}
                placeholder="Název"
              />
            </td>
            <td>
              <input
                type="text"
                bind:value={category.description}
                placeholder="Popis"
              />
            </td>
            <td>
              <input
                type="number"
                bind:value={category.duration}
                placeholder="Délka"
              />
            </td>
            <td>
              <input
                type="checkbox"
                bind:checked={category.visible}
              />
            </td>
            <td>
              <a href="{category.imgSrc}" target="_blank">Otevřít</a>
            </td>
            <td>
              <button on:click={() => updateCategory(category)}>Uložit</button>
              <button on:click={() => deleteCategory(category.id)}>Smazat</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  