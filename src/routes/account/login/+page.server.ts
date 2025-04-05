import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';




const api_login = "/api/Security/Account/Login"
const api_getUser = "/api/Security/Account/GetUser"


const registerScheme = z
  .object({
    email: z.string().email({ message: 'neplatný email' }),
    password: z.string().min(6, { message: 'min. 6 znaků' }),
  })

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(registerScheme));
    return { form };
}

export const actions: Actions = {
    default: async ({ request, cookies }: { request: Request; cookies: Cookies }) => {
      const form = await superValidate(request, zod(registerScheme));
      if (!form.valid) {
        return fail(400, { form });
      }
      try {
        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_login}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form.data)
        });
  
        if (!response.ok) {
          let errorData: { message?: string; errors?: string[] } = {};
          try {
            errorData = await response.json();
          } catch (e) {
            errorData.message = await response.text();
          }
          console.log('Error response:', errorData);
          return fail(response.status, { form });
        }
        
        const result = await response.json();
        const token = result.token; 
        cookies.set('jwt', `${token}`, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax'
          // Secure: true in production (HTTPS)
        });
        
        const jwt = cookies.get('jwt');
        const response_user = await fetch(`${PUBLIC_VITE_API_ROOT}${api_getUser}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            cookie: `jwt=${jwt}`
          },
          credentials: 'include'
        });
        
        let data = await response_user.json();
        console.log('User data:', data.user);
        
        // Return the updated form state along with extra data.
        return { form, user: data.user, message: "Login successful" };
        
      } catch (e) {
        console.error(e);
        return fail(500, { form });
      }
    }
  }
