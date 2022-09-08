module.exports = {
    plugins: [
        require('css-mqpacker'),
        require('autoprefixer')({grid: true}),
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        })
    ]
}