const { populate } = require('../src/utils')

test('missing collection folder', () => {
  const result = populate({
    name: 'missing',
    extension: 'yml'
  })
  expect(result).toHaveProperty('items')
  expect(result.items).toHaveLength(0)
})

test('with a collection folder that doesnt exist', () => {
  const result = populate({
    name: 'doesnt_exist',
    folder: 'folder_that_doesnt_exist',
    extension: 'yml'
  })
  expect(result).toHaveProperty('items')
  expect(result.items).toHaveLength(0)
})
