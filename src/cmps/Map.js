import React from 'react';
//import almostEqual from 'almost-equal';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import L from 'leaflet';
L.Icon.Default.imagePath = '/leaflet/';
require('leaflet/dist/leaflet.css');

import config from 'json!../../app.config.json';
import Actions from '../actions';
import Store from '../store';

function getFeatureColor(feature, tempRange) {
	var t = feature.properties.temp;
	var hue = 180 - 180 * (t - tempRange.tMin)/(tempRange.tMax - tempRange.tMin);
	return tinycolor({ h: hue, s: 1, l: .5 }).toHexString();
}

function setCurrentMarker(point, map) {
	if (map._marker) {
			map.removeLayer(map._marker);					
	}
	var marker = L.marker(point);
	map.addLayer(marker);
	map._marker = marker;
}

function createLayer(geoJsonData, date, tempRange, map) {
	return L.geoJson(geoJsonData, {
	    	style: function(feature) {
	    		var color = getFeatureColor(feature, tempRange);
   	   	return {color: color};
    		},
    		pointToLayer: function(feature, latlng) {
      		var c = new L.CircleMarker(latlng, {radius: 8, opacity: .85, fillOpacity: .85});
      		c.on('click', () => {
					Actions.changePoint(feature.geometry.coordinates);
					setCurrentMarker(arguments[1], map);
					map.closePopup();
      		});
      		var popup = new L.Popup({});
      		popup.setLatLng(latlng);
    			popup.setContent('Temp: ' + feature.properties.temp.toFixed(3));
      		c.on('contextmenu', () => {popup.openOn(map) });
      		return c;
    		},
    		filter: function(feature, layer) {
        		return feature.properties.date == date;
    		}
		});
}


export default React.createClass({
	
	_layers: {},
	
	_currentLayer: null,
	
	_map: null,
	
	getInitialState() {
		return Store.getAppState();	
	},
	
	_setLayers() {		
		var geoJsonData = Store.geoJsonData;
		var tempRange = Store.tempRange;
		var datesRange = Store.datesRange;
		
		for (let date of datesRange) {
			this._layers[date] = createLayer(geoJsonData, date, tempRange, this._map);
		}
		
	},
	
	componentDidMount() {
		var el = document.getElementById(this.props.id);		
		
		var geoJsonData = Store.geoJsonData;
		var map = L.map('map').setView(geoJsonData.features[0].geometry.coordinates, 1);				
		this._map = map;
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', config.leaflet).addTo(map);	
		
		this._setLayers();
		//default layer
		var geojsonLayer = this._layers[this.state.dateInfo.date];
		map.addLayer(geojsonLayer);
		//default point
		setCurrentMarker(new L.LatLng(this.state.point[1], this.state.point[0]), map);		
		
		map.fitBounds(geojsonLayer.getBounds());
		
		map.on('blur', () => map.closePopup );

		Store.addListener(this.onStoreChanged);
	},
	
	onStoreChanged: function() {
		this._map.closePopup();
		this.setState(Store.getAppState());
		this._applyChangesToMap();
	},
	
	_applyChangesToMap: function() {
		var date = this.state.dateInfo.date;
		this._setCurrentLayer(date);
	},
	
	_setCurrentLayer(date) {
		if (this._currentLayer) {
			this._map.removeLayer(this._currentLayer);				
		}
		this._currentLayer = this._layers[date];
		this._map.addLayer(this._currentLayer);
	},
	
	render() {
		return (<div>
					<div id={this.props.id}>Map is here</div>
				  	<p className="comment">
				  		Click the circle to see it's graph<br/>
				  		Right click the circle to see it's temperature this year.
				  	</p>
				  </div>);	
	}
	
});