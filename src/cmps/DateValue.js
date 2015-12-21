import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../store';
import Actions from '../actions';

export default React.createClass({

	getInitialState() {
		var appState = Store.getAppState();	
		return this._parseAppState(appState);
	},
	
	_parseAppState(appState) {
		var date = appState.dateInfo.date;
		var mon = date.slice(4,6);
		var year = date.slice(0,4);
		return {mon, year};
	},
	
	componentDidMount() {
		Store.addListener(this.onStoreChanged);	
	},
	
	render() {
		return (<p>
			<span>Date: </span>
			<span className="date-value">{this.state.mon}/{this.state.year}</span>
			</p>)
	},
	
	onStoreChanged() {
		var appState = Store.getAppState();
		var state = this._parseAppState(appState);
		this.replaceState(state);
	}
});