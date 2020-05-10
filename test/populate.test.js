const { populate } = require('../src/utils')

test('missing collection folder', () => {
  const result = populate({
    name: 'missing',
    folder: 'folder_that_doesnt_exist',
    extension: 'yml'
  })
  expect(result).toHaveProperty('items')
  expect(result.items).toHaveLength(0)
})
