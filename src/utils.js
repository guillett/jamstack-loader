const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

function read(sourcePath) {
  return {
    source: fs.readFileSync(sourcePath),
    sourcePath
  } 
}

function load(source) {
  return yaml.safeLoad(source)
}

function parse(config, sourcePath) {
  const loader = this
  config.sourcePath = sourcePath

  if (!config.collections) {
    throw `Missing collections at ${sourcePath}. Content ${JSON.stringify(config, null, 1)}`
  }
  const rootFolder = path.join(path.dirname(sourcePath), config.root ? config.root : '.')

  config.collections = config.collections.reduce((accum, collection) => {
    if (!collection.folder) {
      return accum
    }

    if (collection.extension !== 'yml') {
      if (loader) {
        loader.emitWarning(`Loader can only process yml files (provided extension: ${collection.extension})`)
      } 
      return accum
    }

    var cPath = path.join(rootFolder, collection.folder)
    accum[collection.name] = {
      ...collection,
      items: fs.readdirSync(cPath).map(itemFile => {
        const slug = path.basename(itemFile, `.${collection.extension}`)
        const itemPath = path.join(cPath, itemFile)

        if (loader && loader.addDependency) {
          loader.addDependency(itemPath)
        }

        return {
          slug,
          ...yaml.safeLoad(fs.readFileSync(itemPath))
        }
      })
    }

    return accum
  }, {})

  return config
}

module.exports = {
  read,
  load,
  parse
}