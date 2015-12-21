import React from 'react';

import jQuery from 'jquery';
window.jQuery = jQuery;
require('flot');
require('flot/jquery.flot.selection');

import Store from '../store';
import Actions from '../actions';

function setZoomHandling($el, plot) {
	$el.unbind("plotselected");
	$el.bind("plotselected", (evt, ranges) => {
		setZoom(plot, ranges.xaxis);
		plot.clearSelection();
		
	});
}

function setZoom(plot, fromToRange) {
	jQuery.each(plot.getXAxes(), function(_, axis) {
		var opts = axis.options;
		opts.min = fromToRange.from;
		opts.max = fromToRange.to;
	});
	plot.setupGrid();
	plot.draw();
}


function resetZoom(plot) {
	setZoom(plot, {from: null, to: null});
}

export default React.createClass({
	
	getInitialState() {
		var appState = Store.getAppState();		
		return this._parseAppState(appState);
	},
	
	_parseAppState(appState) {
		var point = appState.point;
		var stats = {
			winter: Store.getPointStats(point, Store.SEASONS.WINTER),
			summer: Store.getPointStats(point, Store.SEASONS.SUMMER)
		};			
		return {point, stats};
	},
	
	componentDidMount() {
		this._$el = jQuery('#' + this.props.id);
		this._applyStateToGraph();
		
		var $button = this._$el.parent().find('button');
		$button.on('click', () => resetZoom(this._plot));
		
		Store.addListener(this.onStoreChanged);	
	},
	
	render() {
		return (
			<div>
				<div id={this.props.id} ></div>
				<p className="comment">
					<span className="toLeft">To zoom in, select area on chart. To zoom out, click reset.</span>
					<button className="toRight">Reset</button>
				</p>
			</div>
			);
	},
	
	onStoreChanged() {
		var appState = Store.getAppState();
		var state = this._parseAppState(appState);
		this.replaceState(state);
		this._applyStateToGraph();
	},
	
	_applyStateToGraph() {
		var stats = this.state.stats;
		this._plot = jQuery.plot(
			this._$el, 
			[{data: stats.summer, label: "Summer"}, {data: stats.winter, label: "Winter"}],
			{
				colors: ["#fdad00", "#8fd8f8"],
				selection: {
                mode: "x"
            }
			}			
		);
		setZoomHandling(this._$el, this._plot);
	}

});