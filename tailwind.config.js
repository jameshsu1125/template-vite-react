/** @type {import('tailwindcss').Config} */
import color from 'tailwindcss/colors';
import { fontSize } from 'tailwindcss/defaultTheme';

delete color.lightBlue;
delete color.warmGray;
delete color.trueGray;
delete color.coolGray;
delete color.blueGray;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      ...fontSize,
    },
    colors: {
      ...color,
      primary: '#870000',
      secondary: '#ff6600',
      tertiary: '#ff0066',
      quaternary: '#00ff00',
      backgroundColor: '#111',
      textColor: '#eee',
    },
    extend: {},
  },
  plugins: ['prettier-plugin-tailwindcss'],
};
