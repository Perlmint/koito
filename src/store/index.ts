import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import accountReducer from "./account";

const store = createStore(combineReducers({
	accounts: accountReducer,
}), applyMiddleware(thunk));

export default store;
