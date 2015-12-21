var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

module.exports = {
	context: __dirname + '/src',
	entry: './index.js',
	
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'	
	},
	
	module: {
		loaders: [
			{
				
				loader: 'babel-loader',
				test: /\.js$/,
				include: __dirname,
				exclude: /(node_mobules|bower_components)/,
				query: {
					presets: ['es2015', 'react']			
				}	
			},
			{
				loader: 'style-loader!css-loader!postcss-loader',
				test: /\.css$/,
				exclude: /(node_mobules|bower_components)/,
				include: __dirname + '/style',
			},
			{
				loader: 'style-loader!css-loader',
				test: /\.css$/,
				include: __dirname 
			},
			{
				loader: 'file-loader',
				test: /\.(png|gif|svg|jpe?g|html)$/			
			}
		]
	},
	
   postcss: function () {
        return [autoprefixer, precss];
   },
   
   plugins: [
		new CopyWebpackPlugin([
			{from: '../node_modules/leaflet/dist/images', to: '../dist/leaflet'}		
		])   
   ]
}