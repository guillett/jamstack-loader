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

function populate(collection, rootFolder) {
  const cPath = path.join(rootFolder ? rootFolder : '.', collection.folder)
  let items = []

  if (collection.extension !== 'yml') {
    if (this) {
      this.emitWarning(`Loader can only process yml files (provided extension: ${collection.extension})`)
    }
  } else {
    try {
      items = fs.readdirSync(cPath).map(itemFile => {
        const slug = path.basename(itemFile, `.${collection.extension}`)
        const itemPath = path.join(cPath, itemFile)

        if (this && this.addDependency) {
          this.addDependency(itemPath)
        }

        return {
          slug,
          ...yaml.safeLoad(fs.readFileSync(itemPath))
        }
      })
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e
      }
    }
  }

  return {
    ...collection,
    items: items
  }
}

function parse(config, sourcePath) {
  if (!config.collections) {
    throw `Missing collections at ${sourcePath}. Content ${JSON.stringify(config, null, 1)}`
  }

  const rootPath = path.join(path.dirname(sourcePath), config.root ? config.root : '.')

  const pop = populate.bind(this)
  config.collections = config.collections.reduce((accum, collection) => {
    accum[collection.name] = pop(collection, rootPath)

    return accum
  }, {})

  return config
}

module.exports = {
  read,
  load,
  populate,
  parse,
}
