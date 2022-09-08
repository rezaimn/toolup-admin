const CracoLessPlugin = require('craco-less');

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    eslint: {
        enable: false,
        mode: 'file',
        configure: {
            /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */
        },
        configure: (eslintConfig, { env, paths }) => {
            return eslintConfig;
        },
        pluginOptions: {
            /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */
        },
        pluginOptions: (eslintOptions, { env, paths }) => {
            return eslintOptions;
        },
    },
    babel: {
        presets: [],
        plugins: [
            'lodash',
            [
                'import',
                {
                    libraryName: '@icon-park/react',
                    libraryDirectory: 'es/icons',
                    camel2DashComponentName: false,
                },
            ],
        ],
        loaderOptions: {
            /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */
        },
    },

    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modules: { localIdentName: '[local]_[hash:base64:5]' },
                        modifyVars: {},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
