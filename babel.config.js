module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        targets:
        {
          browsers: '>3%',
        },
        polyfills: [],
        bugfixes: true,
        useBuiltIns: false,
        include: [
          '@babel/plugin-proposal-optional-chaining', // parsing fails on optional operator without this
        ],
      }
    ],
  ]
};
