import type { PageServerLoad } from './$types';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
    const request_get = '/api/Security/Account/GetAllUsers';
    let response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_get}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include' // Server-side fetch will forward cookies if configured properly
    });

    if (!response.ok) {
        console.error('Failed to fetch users:', response.statusText);
        return { users: [] };
    }

    const data_users = await response.json();

    const request_get_roles = '/api/Security/Account/GetAllRoles';
    response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_get_roles}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include' // Server-side fetch will forward cookies if configured properly
    });

    if (!response.ok) {
        console.error('Failed to fetch users:', response.statusText);
        return { users: [] };
    }

    const roles = await response.json();

    return { users: data_users, roles: roles };
};