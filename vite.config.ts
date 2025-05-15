import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
		  $assesments: path.resolve('./src/lib/assesments'),
		  $components: path.resolve('./src/lib/components'),
		  $types: path.resolve('./src/types'),
		  $lib: path.resolve('./src/lib'),
		  $styles: path.resolve('./src/styles'),
		  $stores: path.resolve('./src/stores'),
		}
	  }
});
