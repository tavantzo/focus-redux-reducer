import { join } from 'path';

const include = [
    join(__dirname, 'src'),
    join(__dirname, 'test')
];
const exclude = [
    join(__dirname, 'node_modules'),
    join(__dirname, 'dist')
];

export default {
    entry: './src/index',
    output: {
        path: join(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'boilerplate',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            // Match js, ts, tsx and jsx files
            { test: /\.(t|j)sx?$/, loader: ['awesome-typescript-loader?module=es6'], include, exclude},
            { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre', include},
        ]
    }
}