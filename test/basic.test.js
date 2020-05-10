const { join } = require('path')
const { read, load, parse } = require('../src/utils')

test('basic usage', () => {
  const sourcePath = join(__dirname, 'env/basic/config.yml')
  const rawData = read(sourcePath)
  const data = load(rawData.source)

  const result = parse(data, rawData.sourcePath)
  expect(result).toHaveProperty('collections')
  expect(result.collections.numbers.items).toHaveLength(1)
})
