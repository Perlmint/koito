import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container, Menu } from "semantic-ui-react";
import store from "./store";
import SubPage from "./sub_page";

class Application extends React.Component {
	public render() {
		return <Router>
			<div>
				<Menu fixed="top">
					<Container>
						<Menu.Item as={Link} header to="/">
							Logo
						</Menu.Item>
					</Container>
				</Menu>
				<Container style={{ marginTop: "5em" }}>
					<Switch>
						<SubPage exact path="/" loader={() => import("./pages/dashboard")}/>
						<SubPage path="/account" loader={() => import("./pages/account")}/>
					</Switch>
				</Container>
			</div>
		</Router>;
	}
}

render(
	<Provider store={store}>
		<Application />
	</Provider>,
	document.getElementById("app"),
);
