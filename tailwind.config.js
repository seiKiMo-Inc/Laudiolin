const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    mode: 'jit',
    theme: {
        extend: {}
    },
    darkMode: 'class',
    plugins: [
        require('tailwind-nord'),
        require('@tailwindcss/forms')
    ]
};

module.exports = config;