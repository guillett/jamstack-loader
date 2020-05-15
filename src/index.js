const utils = require('./utils')

function loader(source) {
  const config = utils.load(source)
  const stack = utils.build.bind(this)(config, this.resourcePath)
  return `export default ${ JSON.stringify(stack, null, 2) }`
}

loader.get = utils.get

module.exports = loader
