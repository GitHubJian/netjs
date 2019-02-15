const { logger: Logger } = require('./logger.js')
// yinru gc-stat

class Log {
  constructor (name) {
    this.name = name

    this.start()
  }

  start () {
    this.st = Date.now()
  }

  end () {
    this.et = Date.now()
  }
}

class Log4j {
  constructor ({ enable } = { enable: true }) {
    this.list = {}
    this.id = 0
    this.enable = enable
  }

  add (name) {
    if (!this.enable) {
      return -1
    }

    let id = this.id
    this.list[id] = new Log(name)
    this.id++

    return id
  }

  get (id) {
    if (id === -1) {
      return { end: () => {} }
    }

    return this.list[id]
  }

  print () {
    if (!this.enable) {
      return
    }

    Object.entries(this.list).forEach(([k, log]) => {
      Logger.consume(`${log.name} -> ${log.et - log.st} ms`)
    })
  }
}

module.exports = Log4j
