import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AccountAddPage from "./add";
import AccountListPage from "./list";

export default function AccountRoute(props: RouteComponentProps) {
	return <React.Fragment>
		<Switch>
			<Route exact path={`${props.match.path}/`} component={AccountListPage} />
			<Route exact path={`${props.match.path}/add`} component={AccountAddPage} />
		</Switch>
	</React.Fragment>;
}
