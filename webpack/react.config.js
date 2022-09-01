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
            ["@"]: `${__dirname}/../src`
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
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
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