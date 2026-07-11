import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#16803C',
          saffron: '#F97316',
          navy: '#0F172A',
        },
      },
    },
  },
  plugins: [],
}
export default config
