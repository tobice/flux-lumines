module.exports = {
    entry: __dirname + '/../index.js',
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader']},
            {test: /\.less$/, loader: 'style!css!less!autoprefixer-loader'}
        ]
    },
    output: {
        path: __dirname + "/../build/",
        publicPath: "http://localhost:9090/build/",
        filename: "bundle.js"
    }
};