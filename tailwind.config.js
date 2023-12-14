const { fontFamily } = require('tailwindcss/defaultTheme')
const { nextui } = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-open-sans)', ...fontFamily.sans],
            mono: [...fontFamily.mono],
        },
        extend: {
            // shadcn
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    darkMode: 'class',
    plugins: [
        require('@headlessui/tailwindcss')({ prefix: 'ui' }),
        require('@tailwindcss/typography'),
        require("tailwindcss-animate"),
        nextui()
    ],
    safelist: [
        'fst-italic',
        'fs-small',
        'text-decoration-underline',
        'text-primary',
        'sticky-top',
    ]
}
