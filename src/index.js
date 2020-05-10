const utils = require('./utils')

module.exports = function loader(source) {
  const stack = utils.parse.bind(this)(utils.load(source), this.resourcePath)
  return `export default ${ JSON.stringify(stack, null, 2) }`
}
