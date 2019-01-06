import { codes } from "currency-codes";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Button, DropdownItemProps, DropdownProps, Form, Header, InputProps, Segment } from "semantic-ui-react";
import { Dispatch, IRootState } from "../../store";
import { AddAccount, IAccount } from "../../store/account";

const CURRENCY_OPTIONS = codes().map((code) => ({
	key: code,
	text: code,
	value: code,
} as DropdownItemProps));

interface IAccountAddProps extends RouteComponentProps {
	accounts: IAccount[];
	dispatch: Dispatch;
}

interface IAccountAddState {
	form: {
		name: string;
		currency: string;
		balance: string;
	};
	wait_store: boolean;
	form_error: Array<keyof IAccountAddState["form"]>;
}

class AccountAddPage extends React.Component<IAccountAddProps, IAccountAddState> {
	public constructor(props: IAccountAddProps, context?: any) {
		super(props, context);

		this.state = {
			form: {
				balance: "0",
				currency: "",
				name: "",
			},
			form_error: [],
			wait_store: false,
		};
	}

	public render() {
		const { balance, currency, name } = this.state.form;
		return <Form>
			<Segment attached="top">
				<Header>Add new account</Header>
			</Segment>
			<Segment attached>
					<Form.Input
						fluid label="Name" placeholder="Name" disabled={this.state.wait_store}
						error={this.state.form_error.includes("name")} required
						value={name} onChange={this.updateForm.bind(this, "name")}/>
				<Form.Group>
					<Form.Select
						label="Currency" options={CURRENCY_OPTIONS} placeholder="Currency" disabled={this.state.wait_store}
						error={this.state.form_error.includes("currency")} required
						value={currency} onChange={this.updateForm.bind(this, "currency")} />
					<Form.Input
						label="Balance" placeholder="Balance" disabled={this.state.wait_store} type="number"
						error={this.state.form_error.includes("balance")} required
						value={balance} onChange={this.updateForm.bind(this, "balance")} />
				</Form.Group>
			</Segment>
			<Button attached="bottom" loading={this.state.wait_store} onClick={this.addAccount}>Add</Button>
		</Form>;
	}

	protected updateForm(name: keyof IAccountAddState["form"], __: any, props: DropdownProps | InputProps) {
		const { value } = props;
		this.setState(update(this.state, {
			form: {
				[name]: {
					$set: (value as string).trim(),
				},
			},
		}));
	}

	protected addAccount = async () => {
		const { name, currency } = this.state.form;
		const balance = parseInt(this.state.form.balance, 10);
		const errors: IAccountAddState["form_error"] = [];
		if (isNaN(balance)) {
			errors.push("balance");
		}
		if (name.length === 0) {
			errors.push("name");
		}
		if (currency.length === 0) {
			errors.push("currency");
		}

		this.setState(update(this.state, { form_error: { $set: errors }}));
		if (errors.length > 0) {
			return;
		}

		this.setState(update(this.state, { wait_store: { $set: true } }));
		await AddAccount(this.props.dispatch, name, currency, balance);
		this.setState(update(this.state, {
			form: {
				$set: {
					balance: "0",
					currency: "",
					name: "",
				},
			},
			wait_store: { $set: false },
		}));

		this.props.history.goBack();
	}
}

export default connect((state: IRootState) => ({ accounts: state.accounts }))(AccountAddPage);
