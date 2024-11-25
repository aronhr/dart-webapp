module.exports = {
    content: [
        './index.html',
        './pages/**/*.{html,js}',
        './components/**/*.{html,js}',
    ],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['dark']
    },
}
