import type { HandleFetch } from '@sveltejs/kit';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
    console.log('handleFetch called');
    if (request.url.startsWith(PUBLIC_VITE_API_ROOT)) {
    // Get the plain cookie header (e.g., "a=1; jwt=TOKEN; b=2")
    const cookieHeader = event.request.headers.get('cookie');
    if (cookieHeader) {
      // Extract the jwt value from the cookie header.
      const jwtMatch = cookieHeader.match(/jwt=([^;]+)/);
      if (jwtMatch && jwtMatch[1]) {
        const jwt = jwtMatch[1];
        if (!jwt) {
          return fetch(request);
        }
        request.headers.set('Authorization', `Bearer ${jwt}`);
      }
    }
  }
  console.log('request', request);
  console.log('request.url', request.url);
  console.log('request.headers', request.headers);
  return fetch(request);
}; 