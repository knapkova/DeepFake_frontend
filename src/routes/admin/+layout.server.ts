import { redirect } from '@sveltejs/kit';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    const jwt = cookies.get('jwt');

    if (!jwt) {
        throw redirect(302, '/account/login');
    }

    const res = await fetch(`${PUBLIC_VITE_API_ROOT}/api/Security/Account/GetUser`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            cookie: `jwt=${jwt}`
        },
        credentials: 'include'
    });

    if (!res.ok) {
        throw redirect(302, '/account/login');
    }

    const data = await res.json();
    const user = data.user;

    if (!user || user.role?.toLowerCase() !== 'admin') {
        throw redirect(302, '/');
    }

    return {};
};
