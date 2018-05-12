const { join } = require("path");

const include = [
    join(__dirname, "src"),
    join(__dirname, "test")
];
const exclude = [
    join(__dirname, "node_modules"),
    join(__dirname, "dist")
];

module.exports = {
    entry: "./src/Reducer.ts",
    output: {
        path: join(__dirname, "dist"),
        libraryTarget: "umd",
        library: "boilerplate",
    },
    devtool: "source-map",
    module: {
        rules: [
            // Match js, ts, tsx and jsx files
            { test: /\.(t|j)sx?$/, use: "awesome-typescript-loader?module=es6", include, exclude},
            { test: /\.js$/, use: "source-map-loader", enforce: 'pre', include},
        ]
    }
}
