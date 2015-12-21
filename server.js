import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMW from 'webpack-dev-middleware';
import webpackHotMW from 'webpack-hot-middleware';

import webpackConfig from './webpack.config.js';
import config from './app.config.json';
const PORT = config.server.port;
const log = console.log.bind(console);

const app = express();
const webpackCompiler = webpack(webpackConfig);

app.use(webpackMW(webpackCompiler));
app.use(webpackHotMW(webpackCompiler));

app.set('view engine', 'jade');
app.set('views', './src');
app.get('/', function (req, res) {
	log('new request came!');
	res.render('index', config.ui);
});

var server = app.listen(PORT, function() {
	var addr = server.address();
	log("server is listening at http://%s:%s", addr.address, addr.port);
});
