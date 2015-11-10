var webpackConfig = require('./webpack')

module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'sinon'],
    files: ['../test.js'],
    preprocessors: {'../test.js': ['webpack', 'sourcemap']},
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: {
        assets: false,
        chunks: false,
        hash: false,
        timings: false,
        version: false
      }
    },
    browsers: ['PhantomJS'],
    reporters: ['mocha']
  })
}
