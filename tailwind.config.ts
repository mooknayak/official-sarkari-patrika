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
          blue: '#0B3D91',
          blueDark: '#082B66',
          blueLight: '#EAF1FB',
          pink: '#FBE1ED',
          pinkAccent: '#D6336C',
        },
      },
    },
  },
  plugins: [],
}
export default config
