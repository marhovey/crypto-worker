const paths = require('react-scripts/config/paths');
const path = require('path');
paths.appBuild = path.join(path.dirname(paths.appBuild), 'docs')
module.exports = function override(config) {
  if(!config.module.rules) {
    config.module.rules = []
  }
  config.module.rules.splice(1, 1, {
    test: /\.worker\.ts$/,
    use: {
      loader: 'worker-loader',
      options: {inline: true}
    }
  })
  return config
}