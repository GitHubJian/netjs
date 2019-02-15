const pathConfig = require('./../config/conf/path.conf.js')
const Copy = require('copy')

const _move_ = (from, to) => {
  return new Promise((resolve, reject) => {
    Copy(from, to, (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}

async function move () {
  let patterns = [
    {
      from: `${pathConfig.asset}/images/**`,
      to: pathConfig.static + '/images'
    }
  ]

  for (const { from, to } of patterns) {
    try {
      await _move_(from, to)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = {
  move
}
