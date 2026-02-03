/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#030303',
                brand: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                accent: '#a855f7',
                primary: '#6366f1',
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'pan': 'pan 100s linear infinite alternate',
            },
            keyframes: {
                'pan': {
                    '0%': { 'background-position': '0% 0%' },
                    '100%': { 'background-position': '100% 100%' }
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
            },
        },
    },
    plugins: [],
}
