const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: `${__dirname}/../src/index.tsx`,
    target: "web",
    devtool: "source-map",
    devServer: {
        static: {
            directory: `${__dirname}/../dist`
        },
        compress: true,
        port: 9000
    },
    resolve: {
        alias: {
            ["@"]: `${__dirname}/../src`,
            app: `${__dirname}/../src`,
            components: `${__dirname}/../src/ui/components`,
            backend: `${__dirname}/../src/backend`,
            frontend: `${__dirname}/../src/ui`
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{loader: "ts-loader"}]
            },
            {
                test: /\.s?css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require("tailwindcss"),
                                    require("autoprefixer")
                                ],
                            },
                        }
                    }
                ],
                exclude: /\.module\.s?([ca])ss$/,
            }
        ]
    },
    output: {
        path: `${__dirname}/../dist`,
        filename: "main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/../src/electron/index.html`
        })
    ]
};