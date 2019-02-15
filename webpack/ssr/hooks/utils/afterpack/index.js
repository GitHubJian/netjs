const pathConfig = require('./../../../../config/path.config.js')
const Copy = require('copy')

const _move_ = (from, to) => {
  return new Promise((resolve, reject) => {
    Copy(from, to, (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}

async function afterpack () {
  const patterns = [
    {
      from: `${pathConfig.dist}/css/*.css`,
      to: pathConfig.static + '/css'
    },
    {
      from: `${pathConfig.dist}/js/*.js`,
      to: pathConfig.static + '/js'
    },
    {
      from: `${pathConfig.dist}/image/*.*`,
      to: pathConfig.static + '/image'
    },
    {
      from: `${pathConfig.dll}/css/*.css`,
      to: pathConfig.static + '/css'
    },
    {
      from: `${pathConfig.dll}/js/*.js`,
      to: pathConfig.static + '/js'
    },
    {
      from: `${pathConfig.dll}/image/*.*`,
      to: pathConfig.static + '/image'
    },
    {
      from: pathConfig.favicon,
      to: pathConfig.static
    }
  ]

  try {
    for (const { from, to } of patterns) {
      await _move_(from, to)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = afterpack
