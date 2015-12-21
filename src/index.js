import React from 'react';
import ReactDOM from 'react-dom';
import Map from './cmps/Map';
import Toggle from './cmps/Toggle';
import Graph from './cmps/Graph';

require('./index.css');

window.onload = () => {
	ReactDOM.render(<Map id="map"/>, document.getElementById('map-ct'));
	ReactDOM.render(<Toggle id="toggle"/>, document.getElementById('toggle-ct'));
	ReactDOM.render(<Graph id="graph"/>, document.getElementById('graph-ct'));
}
