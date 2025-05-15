<script lang="ts">
    import '../../../styles/form.css'
    import type { User } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
  
    export let data: { 
        users: User[], 
        roles: { id: number; name: string; normalizedName: string; concurrencyStamp: string | null }[] 
    };
  
  
    // Map each user's role (received as string) to its corresponding id.
    let editedRoles: Record<string, string> = {};
    data.users.forEach((user) => {
      const roleObj = data.roles.find(r => r.name === user.role || r.normalizedName === user.role);
      editedRoles[user.email] = roleObj ? roleObj.id.toString() : (data.roles[0]?.id.toString() || '');
    });
  
    // Track loading state for update and delete actions per user.
    let loadingUpdate: Record<string, boolean> = {};
    let loadingDelete: Record<string, boolean> = {};
  
    async function updateRole(user: User) {
      loadingUpdate[user.email] = true;
      const selectedRoleId = +editedRoles[user.email];
      const selectedRole = data.roles.find(r => r.id === selectedRoleId);
  
  
      if (!selectedRole) {
        alert(`Role not found for ${user.email}`);
        loadingUpdate[user.email] = false;
        return;
      }
      
      const response = await fetch(
        `${PUBLIC_VITE_API_ROOT}/api/Security/Account/UpdateUserRoles/${user.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify([selectedRoleId])
        }
      );
  
      if (response.ok) {
        alert(`Role updated for ${user.email}`);
        user.role = selectedRole.name;
      } else {
        alert(`Failed to update role for ${user.email}`);
      }
      loadingUpdate[user.email] = false;
    }
  
    async function deleteUser(user: User) {
      loadingDelete[user.email] = true;
      const response = await fetch(
        `${PUBLIC_VITE_API_ROOT}/api/Security/Account/DeleteUser/${user.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }
      );
  
      if (response.ok) {
        alert(`User ${user.email} deleted.`);
        data.users = data.users.filter(u => u.email !== user.email);
      } else {
        alert(`Failed to delete user ${user.email}`);
      }
      loadingDelete[user.email] = false;
    }
</script>
  
<style>
    .users-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }
    .user-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f5f5f5;
        padding: 1rem;
        margin-bottom: 0.75rem;
        border-radius: 4px;
    }
    .user-info {
        flex: 1;
    }
    .user-actions {
        display: flex;
        gap: 0.5rem;
    }
    select {
        margin-right: 0.5rem;
    }
    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .btn-update {
        background-color: #4CAF50;
        color: white;
    }
    .btn-delete {
        background-color: #f44336;
        color: white;
    }
</style>
  
<h2>Úprava uživatelů</h2>
<div class="users-container">
    {#if data.users.length > 0}
        {#each data.users as user (user.email)}
            <div class="user-card">
                <div class="user-info">
                    <strong>{user.email}</strong>
                </div>
                <div class="user-actions">
                    <select bind:value={editedRoles[user.email]}>
                        {#each data.roles as role}
                            <option value={role.id.toString()}>{role.name}</option>
                        {/each}
                    </select>
                    <button 
                        class="btn btn-update" 
                        disabled={loadingUpdate[user.email] || false} 
                        on:click={() => updateRole(user)}>
                        {#if loadingUpdate[user.email]}
                            Updating...
                        {:else}
                            Update
                        {/if}
                    </button>
                    <button 
                        class="btn btn-delete" 
                        disabled={loadingDelete[user.email] || false} 
                        on:click={() => deleteUser(user)}>
                        {#if loadingDelete[user.email]}
                            Deleting...
                        {:else}
                            Delete
                        {/if}
                    </button>
                </div>
            </div>
        {/each}
    {:else}
        <p>No users found.</p>
    {/if}
</div>