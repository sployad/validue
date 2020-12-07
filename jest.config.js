module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    transformIgnorePatterns: [`/node_modules/(?!(validue|class-validator))`],
    globals: {
        'ts-jest': {
            diagnostics: false,
            disableSourceMapSupport: true,
        }
    }
};
