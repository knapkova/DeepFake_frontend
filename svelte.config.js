import adapter from '@sveltejs/adapter-node';
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
    adapter: adapter({ out: 'build' }),


    // if you serve from a GitHub Pages sub-path:
    paths: {
      base: dev ? '' : '/DeepFake_frontend'    }
  }
};

export default config;