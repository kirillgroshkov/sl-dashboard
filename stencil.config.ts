import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  plugins: [
    sass({
      injectGlobalPaths: [
        // 'src/scss/bootstrap.scss',
        // 'src/scss/global.scss',
      ]
    }),
  ],
  outputTargets: [
    {
      type: 'www',
      baseUrl: 'https://sl-dashboard.netlify.com',
      serviceWorker: null,
    }
  ]
};
