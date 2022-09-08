const colors = require('tailwindcss/colors')


module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: {
                '100': '#F4F4F4',
                '125': '#D5D5D5',
                '150': '#C4C4C4',
                '200': 'rgba(244, 244, 244, 0.5)',
                '300': '#747474',
                '400': 'rgba(1, 57, 94, 0.05)',
                '500': '#212121'
            },
            red: colors.red,
            yellow: colors.yellow,
            blue: {
                500: '#024774',
                600: '#01395E',
                700: '#012e4c'
            },
            green: colors.green,

        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            }
        }
    },
    variants: {
        extend: {
            fontWeight: ['hover'],
        },
    },
    plugins: [],
}