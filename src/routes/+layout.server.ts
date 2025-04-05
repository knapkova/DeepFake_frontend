import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const jwt = cookies.get('jwt');
  if (jwt) {
    const res = await fetch(`${PUBLIC_VITE_API_ROOT}/api/Security/Account/GetUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: `jwt=${jwt}`
      },
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      return { user: data.user };
    }
  }
  return { user: null };
};
