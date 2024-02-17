import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				'honeydew': '#DFF8EB',
				'straw': '#E0DC51',
				'bone': '#DED7C3',
				'tropical-indigo': '#8982E0',
				'english-violet': '#484661',
				'ebony': '#616046',
				'ripe-melon': '#FEB9AA',
				'light-ivory': '#E6D690',
				'columbia-blue': '#AAF0FE',
				'celeste': '#B8AAFE',
				'light-yellow': '#FEE2AA',
				'charcoal': '#364156',
				'oxford-blue': '#011638',
				'cal-poly-green': '#214E34'
			}
		}
	},
	plugins: []
}
export default config
