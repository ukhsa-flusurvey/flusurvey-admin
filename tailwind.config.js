const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-open-sans)', ...fontFamily.sans],
        },
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
