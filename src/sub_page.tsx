import React from "react";
import Loadable, { Options } from "react-loadable";
import { Route, RouteProps } from "react-router";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type ISubPageProps<Props, Exports extends object> = RouteProps & Omit<Options<Props, Exports>, "loading">;

export default function SubPage<Props, Exports extends object>(props: ISubPageProps<Props, Exports>) {
	const {loader, component, ...rest} = props;
	const LoadableComponent = Loadable({
		loader: loader as any,
		loading: () => <div className="loading-inspector">
			<div className="lds-facebook"><div></div><div></div><div></div></div>
		</div>,
	});

	return <Route component={LoadableComponent} {...rest} />;
}
