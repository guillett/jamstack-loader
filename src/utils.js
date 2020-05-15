const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

function read(sourcePath) {
  return {
    source: fs.readFileSync(sourcePath),
    sourcePath
  } 
}

const load = yaml.safeLoad

function populate(collection, rootFolder) {
  let items = []

  if (! collection.folder) {
    if (this && this.emitWarning) {
      this.emitWarning(`Loader can only process collection with a folder (collection: ${collection.name})`)
    }
  } else if (collection.extension !== 'yml') {
    if (this && this.emitWarning) {
      this.emitWarning(`Loader can only process yml files (provided extension: ${collection.extension})`)
    }
  } else {
    const cPath = path.join(rootFolder ? rootFolder : '.', collection.folder)
    if (this && this.addContextDependency) {
      this.addContextDependency(cPath)
    }

    const context = this

    try {
      items = fs.readdirSync(cPath).map(itemFile => {
        const slug = path.basename(itemFile, `.${collection.extension}`)
        const itemPath = path.join(cPath, itemFile)

        if (context && context.addDependency) {
          context.addDependency(itemPath)
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

function build(config, sourcePath) {
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

function get(configPath) {
  const config = read(configPath)
  return build(load(config.source), config.sourcePath)
}

module.exports = {
  get,
  read,
  load,
  populate,
  build,
}
