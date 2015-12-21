import $ from 'jquery';
require('jquery-ui/slider');
require('jquery-ui/themes/base/jquery-ui.css');
require('jquery-ui/themes/base/jquery.ui.slider.css');

import React from 'react';
import ReactDOM from 'react-dom';

require('./Toggle.css');
import Store from '../store';
import Actions from '../actions';
import DateValue from './DateValue';

export default React.createClass({
	
	getInitialState() {
		return Store.getAppState().dateInfo;	
	},
	
	componentDidMount() {
		var el = ReactDOM.findDOMNode(this);
		var valueCt = $(el).find('.date-value');
		var datesRange = Store.datesRange;
		
		var _this = this;
		$('#' + this.props.id).slider({
			value: this.state.index,
      	min: 0,
      	max: datesRange.length - 1,
      	step: 1,
			slide: function(event, ui) {
				var index = ui.value;
				var date = datesRange[ui.value];
				//var fmt_dt = date.slice(4,6) + '/' + date.slice(0,4);
				//valueCt.html(fmt_dt);
				_this.replaceState({date, index});
				Actions.changeDate(date, index);	
			}
		});
	},
	
	render() {
		return (
			<div className="dates-slider">
				<div id={this.props.id}/>
				<DateValue/>
				<p className="comment">Use toggle to change selected year on the map.</p>
			</div>
		)
	}	
	
});