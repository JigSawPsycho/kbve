const {
	createGlobPatternsForDependencies,
} = require('@nxtensions/astro/tailwind');
const { join } = require('path');
// const { buildConfig } = require('../../packages/uti/src/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = buildConfig(__dirname, {
	content: [
		join(
			__dirname,
			'src/**/!(*.stories|*.spec).{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
		),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		extend: {
			colors: {
				// Color extension is prefixed as KBVE to avoid class conflicts
				kbve: '#8C52FF',

				'kbve-primary': '#48BB78',
				'kbve-primary-light': '#48BB78',

				'kbve-secondary': '#1c033c',

				'kbve-menu-primary': '#27272A',
				'kbve-svg-primary': '#91ffff',
				'kbve-svg-primary-dyn': 'var(--color-kbve-svg-primary-dyn)',
				'kbve-text-primary': '',
				'kbve-text-primary-dyn': 'var(--color-kbve-text-primary-dyn)',
				'kbve-text-secondary': '',
				'kbve-text-secondary-dyn': 'var(--color-kbve-text-secondary-dyn)',
			},
			backgroundColor: {
				default: 'var(--color-background)',
				'kbve-menu-bg': '#09090b',
				'kbve-menu-bg-dyn': 'var(--color-kbve-menu-bg-dyn)',

				offset: '#23262d',
			},

			backgroundImage: (theme) => ({
				'custom-gradient': `linear-gradient(to right, ${theme(
					'colors.kbve'
				)}, ${theme('colors.kbve-primary')}, ${theme(
					'colors.kbve-secondary'
				)})`,
			}),

			keyframes: {
				float: {
					'0%, 100%': { transform: 'translate3d(0, 0, 0)' },
					'50%': { transform: 'translate3d(0, 30px, 0)' },
				},
				'ltr-linear-infinite': {
					'0%, 100%': { 'background-position': '0 0' },
					'50%': { 'background-position': '400% 0%' },
				},
			},
		},
	},
});
