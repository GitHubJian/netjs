const root = process.cwd()
const path = require('path')
const fs = require('fs')
const merge = require('deepmerge')

const ENABLE = true

const defaultConfig = {
  enable: true,
  dir: 'setting',
  env: 'production',
  instance: '',
  separator: '-'
}

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

function mergeOptions() {
  let args = Array.prototype.slice.call(arguments)
  let res = merge.all(args, { arrayMerge: overwriteMerge })

  return res
}

function parseFile(fullFilename) {
  let configObject = {}
  try {
    let stat = fs.statSync(fullFilename)
    if (!stat || stat.size < 1) {
      return {}
    }

    configObject = require(fullFilename)

    return configObject
  } catch (e) {
    console.warn(`[Read-Options-File Warn]: File Not Found, \n${fullFilename}`)
    return {}
  }
}

function loader(fileName /*, configDir*/) {
  let personalizeConf = {}
  let fileDir = path.resolve(root, './personalize.conf.json')
  let isExists = fs.existsSync(fileDir)
  if (isExists) {
    personalizeConf = require(fileDir)
  }

  const personalizeConf = require('./../personalize.conf.json')
  let { enable, dir, env, instance, separator } = mergeOptions(
    defaultConfig,
    personalizeConf
  )

  let realDir = path.join(root, dir)

  let extname = path.extname(fileName),
    fileBaseName = path.basename(fileName, extname)

  let baseNames = [fileBaseName]

  // 是否开启，灵活控制
  if (ENABLE && enable === true) {
    baseNames.push([fileBaseName, env].join(separator))

    if (instance) {
      baseNames.push([fileBaseName, env, instance].join(separator))
    }
  }

  let configObj = baseNames.reduce((prev, cur) => {
    let fullFilename = path.join(realDir, `${cur}${extname}`)
    let optionObj = parseFile(fullFilename)
    if (optionObj) {
      config = mergeOptions(prev, optionObj)
    }

    return config
  }, {})

  return configObj
}

function reader(fileName, opts) {
  let { enable, dir, env, instance, separator } = mergeOptions(
    defaultConfig,
    opts
  )

  let realDir = path.join(root, dir)

  let extname = path.extname(fileName),
    fileBaseName = path.basename(fileName, extname)

  let baseNames = [fileBaseName]

  // 是否开启，灵活控制
  if (ENABLE && enable === true) {
    baseNames.push([fileBaseName, env].join(separator))

    if (instance) {
      baseNames.push([fileBaseName, env, instance].join(separator))
    }
  }

  let configObj = baseNames.reduce((prev, cur) => {
    let fullFilename = path.join(realDir, `${cur}${extname}`)
    let optionObj = parseFile(fullFilename)
    if (optionObj) {
      config = mergeOptions(prev, optionObj)
    }

    return config
  }, {})

  return configObj
}

module.exports = {
  reader,
  loader
}
