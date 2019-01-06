import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Container, Header, Item, Segment } from "semantic-ui-react";
import { Dispatch, IRootState } from "../../store";
import { IAccount, RemoveAccount } from "../../store/account";

interface IAccountListProps {
	accounts: IAccount[];
	dispatch: Dispatch;
}

interface IAccountListState {
	wait_store: boolean;
}

class AccountListPage extends React.Component<IAccountListProps, IAccountListState> {
	public constructor(props: IAccountListProps, context?: any) {
		super(props, context);

		this.state = {
			wait_store: false,
		};
	}

	public render() {
		return <div>
			<Header attached="top">Summary</Header>
			<Segment attached>
			</Segment>

			<Segment attached="top" textAlign="right">
				<Link to="./add">
					<Button icon="plus" content="Add account" />
				</Link>
			</Segment>
			<Segment attached>
				<Item.Group divided>
					{ this.props.accounts.map((account) =>
						<Item key={account.uid}>
							<Item.Image size="tiny" src={ _.defaultTo(account.icon, "") } />
							<Item.Content>
								<Item.Header>{ account.name }</Item.Header>
								<Item.Description>balance: { account.currency } { account.balance }</Item.Description>
								<Item.Extra>
									<Button
										floated="right" color="red" icon="remove" content="Remove"
										loading={this.state.wait_store}
										onClick={this.removeAccount.bind(this, account.uid!)}
									/>
								</Item.Extra>
							</Item.Content>
						</Item>,
					) }
					<Container textAlign="center">
						{ this.props.accounts.length === 0 ? "No account! please add new account" : undefined }
					</Container>
				</Item.Group>
			</Segment>
		</div>;
	}

	protected async removeAccount(uid: number) {
		this.setState({ wait_store: true });
		await RemoveAccount(this.props.dispatch, uid);
		this.setState({ wait_store: false });
	}
}

export default connect((state: IRootState) => ({ accounts: state.accounts }))(AccountListPage);
