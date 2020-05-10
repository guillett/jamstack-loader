const utils = require('./utils')

module.exports = function loader(source) {
  console.log('her')
  const stack = utils.parse.bind(this)(utils.load(source), this.resourcePath)

  console.log(stack)

  return `export default ${ JSON.stringify(stack, null, 2) }`
}
