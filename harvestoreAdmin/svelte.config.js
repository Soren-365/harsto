import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'build' }),
		browser: {
			hydrate: true,
			router: true
		  },
	},

	preprocess: [
		preprocess({
		  postcss: true,
		}),
	  ],

};

export default config;
