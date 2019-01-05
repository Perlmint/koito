import React from "react";
import { render } from "react-dom";

class Application extends React.Component {
	public render() {
		return <p>Hello, World!</p>;
	}
}

render(<Application />, document.getElementById("app"));
