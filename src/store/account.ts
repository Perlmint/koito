import Dexie from "dexie";
import update, { Spec } from "immutability-helper";
import _ from "lodash";
import { Dispatch } from "redux";

export interface IAccount {
	uid?: number;
	name: string;
	icon?: string;
	currency: string;
	balance: number;
}

export class AccountDatabase extends Dexie {
	public accounts!: Dexie.Table<IAccount, number>;

	constructor() {
			super("AccountDatabase");
			this.version(1).stores({
					accounts: "++uid,name,icon,currency,balance",
			});
	}
}

const db = new AccountDatabase();

export type IAccountState = IAccount[];

const defaultAccountState: IAccountState = [];

namespace AccountAction {
	export const ADD = Symbol("Account add action");
	export const UPDATE = Symbol("Account update action");
	export const DELETE = Symbol("Account delete action");

	export type Type = typeof ADD | typeof UPDATE | typeof DELETE;
}

type AccountAction = {
	type: typeof AccountAction.ADD,
	data: IAccount,
} | {
	type: typeof AccountAction.UPDATE,
	uid: number,
	data: Partial<IAccount>,
} | {
	type: typeof AccountAction.DELETE,
	uid: number,
};
type AccountDispatch = Dispatch<AccountAction>;

export function LoadAccounts() {
	return (dispatch: AccountDispatch) => {
		db.transaction("r", db.accounts, async () => {
			const accounts = await db.accounts.toArray();

			for (const account of accounts) {
				dispatch({
					data: account,
					type: AccountAction.ADD,
				});
			}
		});
	};
}

export async function AddAccount(
	dispatch: AccountDispatch,
	name: string, currency: string, balance?: number, icon?: string,
) {
	const newItem = await db.transaction("rw", db.accounts, async () => {
		const newItemData: IAccount = {
			balance: _.defaultTo(balance, 0),
			currency,
			icon,
			name,
		};

		newItemData.uid = await db.accounts.add(newItemData);

		return newItemData;
	});

	dispatch({
		data: newItem,
		type: AccountAction.ADD,
	});

	return newItem;
}

export async function RemoveAccount(
	dispatch: AccountDispatch,
	uid: number,
) {
	await db.transaction("rw", db.accounts, async () => {
		await db.accounts.delete(uid);

		dispatch({
			type: AccountAction.DELETE,
			uid,
		});
	});
}

export default function accountReducer(state = defaultAccountState, action: AccountAction) {
	const spec: Spec<IAccountState> = {};

	if (action.type === AccountAction.ADD) {
		_.setWith(spec, ["$push"], [action.data], Object);
	} else if (action.uid !== undefined) {
		const idx = state.findIndex((account) => account.uid === action.uid);
		if (idx === -1) {
			throw new Error(`Not existing account for uid ${action.uid}`);
		}
		if (action.type === AccountAction.UPDATE) {
			_.setWith(spec, [idx, "$merge"], action.data, Object);
		} else if (action.type === AccountAction.DELETE) {
			_.setWith(spec, ["$splice"], [[idx, 1]], Object);
		}
	}

	return update(state, spec);
}
