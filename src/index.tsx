import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container, Menu } from "semantic-ui-react";
import Dashboard from "./pages/dashboard";
import store from "./store";

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
					<Route exact path="/" component={Dashboard} />
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
