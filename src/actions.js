import AppDispatcher from './dispatcher';
import Store from './store';

const ActionsFactory = {
	
	changeDate(date, index) {
		AppDispatcher.handleViewAction({
			actionType: Store.DATE_CHANGED,
			data: { date, index }
		});
	},
	
	changePoint(coordinates) {
		AppDispatcher.handleViewAction({
			actionType: Store.POINT_CHANGED,
			data: coordinates
		});
	}

}

export default ActionsFactory