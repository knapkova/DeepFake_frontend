import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.env.NODE_ENV === 'development';

const config = {
  preprocess: sveltePreprocess(),

  kit: {
    alias: {
      '$types/*': 'src/types/*',
      '$components/*': 'src/components/*',
      '$assesments/*': 'src/assesments/*',
      '$styles/*': 'src/styles/*'
    },

    adapter: adapter({
      pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
    }),

    // if you serve from a GitHub Pages sub-path:
    paths: {
      base: dev ? '' : '/DeepFake_frontend'    }
  }
};

export default config;