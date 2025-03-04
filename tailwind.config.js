export const content = [
  './src/**/*.{js,ts,jsx,tsx}',
  './src/app/**/*.{js,ts,jsx,tsx}',
  './src/pages/**/*.{js,ts,jsx,tsx}',
  './src/components/**/*.{js,ts,jsx,tsx}',
];
export const darkMode = 'media';
export const theme = {
  extend: {
    colors: {
      primary: '#1DA1F2',
      secondary: '#FF9900',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    spacing: {
      72: '18rem',
      84: '21rem',
      96: '24rem',
    },
  },
};
export const variants = {
  extend: {
    opacity: ['disabled'],
    backgroundColor: ['active'],
  },
};
export const plugins = [];