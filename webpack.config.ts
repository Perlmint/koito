import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";

const devMode = process.env.NODE_ENV !== "production";

export default function() {
	return {
		devServer: {
			historyApiFallback: true,
		},
		devtool: "source-map",
		entry: path.join(__dirname, "src", "index.tsx"),
		mode: devMode ? "development" : "production",
		module: {
			rules: [
				{
					include: /\.tsx?$/,
					loaders: ["ts-loader"],
				},
				{
					include: /\.css$/,
					loaders: [
						devMode ? "style-loader" : MiniCssExtractPlugin.loader,
						"css-loader",
					],
				},
				{
					include: /\.(woff|woff2|eot|ttf|otf|png|svg)$/,
					loader: "file-loader",
				},
			],
		},
		output: {
			path: path.join(__dirname, "out"),
			publicPath: "/",
		},
		plugins: [
			new HtmlPlugin({
				template: "src/index.html",
			}),
			...(!devMode ? [
				new MiniCssExtractPlugin({
					filename: "styles.css",
				}),
			] : []),
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
