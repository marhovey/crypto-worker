module.exports = function override(config, env) {
  if(!config.module.rules) {
    config.module.rules = []
  }
  config.module.rules.splice(1, 0, {
    test: /\.worker\.ts$/,
    use: {
      loader: 'worker-loader',
      options: {inline: true}
    }
  })
  return config
}