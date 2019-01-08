import HtmlPlugin from "html-webpack-plugin";
import _ from "lodash";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import StyleExtHtmlWebpackPlugin from "style-ext-html-webpack-plugin";
import webpack from "webpack";

const devMode = process.env.NODE_ENV !== "production";

export default function() {
	const srcRoot = path.join(__dirname, "src");
	const cssLoader = (inline: boolean = false) => {
		const ret: webpack.RuleSetUse = ["css-loader"];

		if (inline || !devMode) {
			ret.unshift(MiniCssExtractPlugin.loader);
		} else {
			ret.unshift("style-loader");
		}

		return ret;
	};

	const entries = ["index.tsx", "loading.less"];

	const entryByExt = _.groupBy(entries, (entry) => path.extname(entry));

	function CreateInlineFilter(ext: string, loaders: webpack.RuleSetUse): webpack.RuleSetRule[] {
		const entry = entryByExt[ext];
		if (entry === undefined) {
			return [{}];
		}

		return [{
			include: entry.map((e) => path.join(srcRoot, e)),
			loaders,
		}];
	}

	function CreateExcludeFilter(ext: string) {
		return _.get(entryByExt, [ext], [] as string[]).map((e) => path.join(srcRoot, e));
	}

	return {
		devServer: {
			historyApiFallback: true,
		},
		devtool: "source-map",
		entry: {
			..._.fromPairs(
				entries.map(
					(filename) => [
						path.basename(filename, path.extname(filename)),
						path.join(srcRoot, filename),
					],
				),
			),
		},
		mode: devMode ? "development" : "production",
		module: {
			rules: [
				{
					include: /\.tsx?$/,
					loaders: ["ts-loader"],
				},
				{
					include: /\.html$/,
					loaders: [{
						loader: "html-loader",
						options: {
							collapseWhitespace: devMode,
							interpolate: "require",
							minimize: !devMode,
							removeComments: !devMode,
						},
					}],
				},
				{
					exclude: CreateExcludeFilter(".less"),
					include: /\.less$/,
					loaders: [
						...cssLoader(),
						"less-loader",
					],
				},
				{
					exclude: CreateExcludeFilter(".css"),
					include: /\.css$/,
					loaders: cssLoader(),
				},
				{
					include: /\.(woff|woff2|eot|ttf|otf|png|svg)$/,
					loader: "file-loader",
				},
				...CreateInlineFilter(".less", [...cssLoader(true), "less-loader"]),
			],
		},
		output: {
			path: path.join(__dirname, "out"),
			publicPath: "/",
		},
		plugins: [
			new HtmlPlugin({
				chunks: _.flatten(
					[".tsx", ".ts"].map(
						(ext) => _.get(entryByExt, [ext], [] as string[]).map(
							(filename) => path.basename(filename, ext),
						),
					),
				),
				inlineSource: ".(css|less)$",
				template: "src/index.html",
			}),
			new MiniCssExtractPlugin({
				filename: "[name].css",
			}),
			new StyleExtHtmlWebpackPlugin(),
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
