import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import accountReducer, { IAccount, LoadAccounts } from "./account";

export interface IRootState {
	accounts: IAccount[];
}

const store = createStore(combineReducers<IRootState>({
	accounts: accountReducer,
}), applyMiddleware(
	thunk as ThunkMiddleware<IRootState> ,
));

export type Dispatch = (typeof store)["dispatch"];

export default store;

// Initialize store
store.dispatch(LoadAccounts());
