import update, { Spec } from "immutability-helper";
import _ from "lodash";
import { Action } from "redux";

export interface IAccount {
	uid: number;
	name: string;
	icon?: string;
}

export interface IAccountState {
	accounts: IAccount[];
}

const defaultAccountState: IAccountState = {
	accounts: [],
};

namespace AccountAction {
	export const ADD = Symbol("Account add action");
	export const UPDATE = Symbol("Account update action");
	export const DELETE = Symbol("Account delete action");

	export type Type = typeof ADD | typeof UPDATE | typeof DELETE;
}

export function AddAccount(name: string, icon?: string) {
	return {
		data: {
			icon,
			name,
		} as IAccount,
		type: AccountAction.ADD,
	};
}

export default function accountReducer(state = defaultAccountState, action: Action<AccountAction.Type>) {
	const spec: Spec<IAccountState> = {};

	switch (action.type) {
		case AccountAction.ADD:
			const newUid = _.defaultTo(_.maxBy(state.accounts, (account) => account.uid), 1);
			_.setWith(spec, ["accounts", "$push"], [_.assign(
				(action as any).data as IAccount,
				{
					uid: newUid,
				},
			)]);
			break;
	}

	return update(state, spec);
}
