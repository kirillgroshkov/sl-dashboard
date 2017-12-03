exports.config = {
  bundles: [
    {
      components: [
        'app-root',
      ],
    },
  ],
  collections: [{ name: '@stencil/router' }],
}

exports.devServer = {
  root: 'www',
  watchGlob: '**/**',
}
