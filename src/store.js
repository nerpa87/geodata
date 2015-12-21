import almostEqual from 'almost-equal';
import AppDispatcher from './dispatcher';
import geoJsonData from 'json!../res/comp_temp.geojson';

//change coordinates order
geoJsonData.features.forEach((feature) => {
	feature.geometry.coordinates.reverse();
});

function getDates(geoJsonData) {
	var all = geoJsonData.features.map((feature) => {
		return feature.properties.date;	
	});
	return _.uniq(all).sort();
}

function getTempRange(geoJsonData) {
	var tMin = 0, tMax = 0;
	geoJsonData.features.forEach((feature) => {
		var t = feature.properties.temp;
		tMax = Math.max(tMax, t);
		tMin = Math.min(tMin, t);
	});
	return {tMin, tMax};
}

function isSamePoint(p1, p2) {
	return almostEqual(p1[0], p2[0]) && almostEqual(p1[1], p2[1]);
}

function dateToObj(date) {
	var year = parseInt(date.slice(0,4));
	var mon = parseInt(date.slice(4,6), 10);
	return {mon, year};
}

var Store = {
	
	DATE_CHANGED: "date_changed",
	
	POINT_CHANGED: "point_changed",
	
	SEASONS: {
		SUMMER: 7,
		WINTER: 1
	},

	geoJsonData: geoJsonData,
	
	datesRange: getDates(geoJsonData),
	
	tempRange: getTempRange(geoJsonData),
	
	_dt: 0,
	
	_index: 0,
	
	_point: null,
	
	_listeners: [],
	
	getAppState () {
		return {dateInfo: this.getDateInfo(), point: this.getPoint()};	
	},
	
	getPoint() {
		if (!this._point) {
			this._point = 	this.geoJsonData.features[0].geometry.coordinates;
		}
		return this._point;
	},
	
	getDateInfo() {
		if (!this._dt) {
			this._dt = this.geoJsonData.features[0].properties.date;
		}
		return {
			date: this._dt,
			index: this._index		
		}
	},
	
	setDateInfo(data) {
		this._dt = data.date;
		this._index = data.index;
	},
	
	setPoint(data) {
		this._point = data;
	},
	
	getPointStats(point, season) {
		var stats = [];
		this.geoJsonData.features.forEach((feature) => {
			if (!isSamePoint(feature.geometry.coordinates, point)) {
				return;			
			}
			var props = feature.properties;
			var d = dateToObj(props.date);
			if (season && season != d.mon) {
				return;
			}
			var dt = d.year + (d.mon-1)/12;
			stats.push([dt, props.temp]);
		});
		return stats;
	},
	
	addListener(callback) {
		this._listeners.push(callback);
		//return index to remove	
	},
	
	emitChange() {
		for (let callback of this._listeners) {
			callback();		
		}	
	}
	
}

AppDispatcher.register(function(payload) {
	
	var action = payload.action;
	
	switch(action.actionType) {
		case Store.DATE_CHANGED:
			Store.setDateInfo(action.data);
			break;
		case Store.POINT_CHANGED:
			Store.setPoint(action.data);
			break;
		default:
			return true;
	}	
	
	Store.emitChange();
	
	return true;
});

export default Store;