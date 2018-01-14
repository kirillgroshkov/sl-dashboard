exports.config = {
  bundles: [
    {
      components: ['app-root', 'app-sl'],
    },
  ],
  collections: [{ name: '@stencil/router' }],
}

exports.devServer = {
  root: 'www',
  watchGlob: '**/**',
}
