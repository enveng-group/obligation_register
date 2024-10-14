// Copyright (C) Enveng Group 2024 Adrian Gallo, Rohan Lonkar and Rhett Bachoup
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Updated to TypeScript entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensure correct path resolution for assets
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Resolve both JavaScript and TypeScript files
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Add support for TypeScript
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Add support for CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Add support for image files
        type: 'asset/resource',
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
    bootstrap: 'bootstrap',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // Serve static files from the public directory
    compress: true,
    port: 9000,
    historyApiFallback: true, // Enable support for HTML5 History API
  },
};
