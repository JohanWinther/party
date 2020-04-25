const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const getServerConfig = env => {
    return {
        target: "node",
        node: {
            __dirname: false,
            __filename: false,
        },
        entry: './source/server/index.ts',
        mode: env.NODE_ENV,
        devtool: env.devtool,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true, // type checking used in plugin
                            experimentalWatchApi: true,
                            compilerOptions: {
                                target: "esnext",
                                module: "CommonJS",
                                removeComments: env.isProduction,
                                preserveConstEnums: !env.isProduction,
                                sourceMap: !env.isProduction
                            }
                        }
                    }
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'build', env.buildFolder),
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
        ]
    };
};

const getClientConfig = env => {
    return {
        target: "web",
        entry: {
            bundle: './source/client/index.ts',
            "socket-client": './source/client/socket-client.ts',
        },
        mode: env.NODE_ENV,
        devtool: env.devtool,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true, // type checking used in plugin
                            experimentalWatchApi: true,
                            compilerOptions: {
                                target: "ES2019",
                                module: "ES6",
                                removeComments: env.isProduction,
                                preserveConstEnums: !env.isProduction,
                                sourceMap: !env.isProduction
                            }
                        }
                    }
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'build', env.buildFolder, 'client'),
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new CopyPlugin([
                {
                    from: path.join(__dirname, 'source', 'client'),
                    ignore: ['*.ts', 'tsconfig.json'],
                },
                {
                    from: path.join(__dirname, 'source', 'games'),
                    to: path.join(__dirname, 'build', env.buildFolder, 'games'),
                },
            ]),
        ]
    };
};

module.exports = env => {

    // Environment
    env.isProduction = env.NODE_ENV === 'production';
    env.devtool = env.isProduction ? false : 'inline-source-map';
    env.buildFolder = env.isProduction ? 'release' : 'development';
    
    return [
        getServerConfig(env),
        getClientConfig(env)
    ]
};