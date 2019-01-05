import HtmlPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";

export default function() {
	return {
		entry: path.join(__dirname, "src", "index.tsx"),
		mode: devMode ? "development" : "production",
		module: {
			rules: [
				{
					include: /\.tsx?$/,
					loaders: ["ts-loader"],
				},
			],
		},
		output: {
			path: path.join(__dirname, "out"),
		},
		plugins: [
			new HtmlPlugin({
				template: "src/index.html",
			}),
		],
		resolve: {
			extensions: [
				".ts",
				".tsx",
				".js",
			],
		},
	} as webpack.Configuration;
}
