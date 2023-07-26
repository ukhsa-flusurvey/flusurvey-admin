const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-open-sans)', ...fontFamily.sans],
            mono: [...fontFamily.mono],
        },
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@headlessui/tailwindcss')({ prefix: 'ui' })
    ],
}
