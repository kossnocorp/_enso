module.exports = {
  devtool: 'inline-source-map',
  entry: {},
  output: {path: '/'},
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json'}
    ]
  }
}
