import path from 'path';
import envVars from 'preact-cli-plugin-env-vars';

const reactToolboxPath = path.resolve('./node_modules', 'react-toolbox');
const containersPath = path.resolve('src', 'containers');

export default (config, env, helpers) => {
  const babelLoader = helpers.getLoadersByName(config, 'babel-loader');
  const babelLoaderRule = babelLoader[0].rule;
  const postcssLoader = helpers.getLoadersByName(config, 'postcss-loader');
  const cssModulesRule = postcssLoader[0].rule;
  const globalCssRule = postcssLoader[1].rule;

  /* Delete postcss config so that postcss.config.js is used instead
   */
  postcssLoader.forEach(({ loader }) => ( delete loader.options ));

  /* Add babel plugins
   */
  babelLoaderRule.options.plugins.push(
    [require.resolve('babel-plugin-root-import'), { rootPathSuffix: 'src' }],
    [require.resolve('babel-plugin-lodash')],
    [require.resolve('babel-plugin-date-fns')],
  );

  /* Use postcss for every css in react-toolbox module
   */
  cssModulesRule.include.push(reactToolboxPath); // Eenable css modules for react-toolbox
  globalCssRule.exclude.push(reactToolboxPath); // Exclude react-toolbox from global css

  /* Enable css modules for containers
   */
  cssModulesRule.include.push(containersPath);
  globalCssRule.exclude.push(containersPath);

  /* Make it possible to use env vars in our code,
   * see https://github.com/robinvdvleuten/preact-cli-plugin-env-vars
   */
  envVars(config);
};
