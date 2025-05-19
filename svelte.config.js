import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.env.NODE_ENV === 'development';

const config = {
  preprocess: preprocess(),

  kit: {
    alias: {
      '$types/*': 'src/types/*',
      '$components/*': 'src/components/*',
      '$assesments/*': 'src/assesments/*',
      '$styles/*': 'src/styles/*'
    },

    adapter: adapter({
      // output folder for the built site
      pages: 'build',
      assets: 'build',
      // no SPA fallback
      fallback: null
    }),

    // if you serve from a GitHub Pages sub-path:
    paths: {
      base: dev ? '' : '/DeepFake_frontend',
      assets: dev ? '' : '/DeepFake_frontend'
    }
  }
};

export default config;