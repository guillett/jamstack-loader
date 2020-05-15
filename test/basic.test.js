const { join } = require('path')
const { get } = require('../src/utils')

test('basic usage', () => {
  const sourcePath = join(__dirname, 'env/basic/config.yml')
  const result = get(sourcePath)
  expect(result).toHaveProperty('collections')
  expect(result.collections.numbers.items).toHaveLength(1)
})
