import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

function emptyReducer(state: any = {}) {
	return state;
}

const store = createStore(emptyReducer, applyMiddleware(thunk));

export default store;
