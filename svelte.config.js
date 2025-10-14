import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			"$types/*":"src/types/*",
			"$components/*":"src/components/*",
			"$assesments/*":"src/assesments/*",
			"$styles/*":"src/styles/*",
		},
		// Using Vercel adapter for deployment
		adapter: vercel(),
		files: {
			assets: 'static'
		}
	}
};

export default config;
