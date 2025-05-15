/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#3366CC', // main primary
          600: '#2952A3',
          700: '#1F3D7A',
          800: '#142952',
          900: '#0A1429',
        },
        secondary: {
          50: '#F2F7FF',
          100: '#E6F0FF',
          200: '#CCE0FF',
          300: '#B3D1FF',
          400: '#99C2FF',
          500: '#80B3FF', // main secondary
          600: '#668FCC',
          700: '#4D6B99',
          800: '#334866',
          900: '#1A2433',
        },
        accent: {
          50: '#FFEDE6',
          100: '#FFDBD0',
          200: '#FFB7A1',
          300: '#FF9473',
          400: '#FF8659',
          500: '#FF7D4D', // main accent
          600: '#CC643D',
          700: '#994B2E',
          800: '#66321F',
          900: '#33190F',
        },
        success: {
          50: '#E6F7EB',
          100: '#CCEED6',
          200: '#99DDAD',
          300: '#66CC85',
          400: '#33BB5C',
          500: '#00AA33',
          600: '#008829',
          700: '#00661F',
          800: '#004414',
          900: '#00220A',
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE299',
          300: '#FFD466',
          400: '#FFC533',
          500: '#FFB700',
          600: '#CC9200',
          700: '#996E00',
          800: '#664900',
          900: '#332500',
        },
        error: {
          50: '#FEEBEB',
          100: '#FDD7D7',
          200: '#FAAFAF',
          300: '#F88787',
          400: '#F65F5F',
          500: '#F43737',
          600: '#C32C2C',
          700: '#922121',
          800: '#621616',
          900: '#310B0B',
        },
        gray: {
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#DCDCE1',
          300: '#C9CAD2',
          400: '#B7B9C3',
          500: '#A4A7B4',
          600: '#838691',
          700: '#62646D',
          800: '#414248',
          900: '#212124',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};