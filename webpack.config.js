'use strict';

module.exports = {
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
    ],
  },
  output: {
    path: __dirname,
    filename: 'Elevation.js',
    library: 'Elevation',
  },
  externals: {
    underscore: '_',
  },
};
