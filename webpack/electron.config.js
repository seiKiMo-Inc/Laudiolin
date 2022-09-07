module.exports = {
    mode: "development",
    entry: `${__dirname}/../src/electron/main.ts`,
    target: "electron-main",
    resolve: {
        alias: {
            ["@"]: `${__dirname}/../src/electron`
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            include: /src/,
            use: [{ loader: "ts-loader" }]
        }]
    },
    output: {
        path: `${__dirname}/../dist`,
        filename: "electron.js"
    }
};