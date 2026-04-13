import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          500: '#2176ff',
          700: '#1759c2',
          900: '#143b73'
        }
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
