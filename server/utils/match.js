const pathToRegexp = require('path-to-regexp')

function match (path, router) {
  let keys = []
  let re = pathToRegexp(router + '/(.+)', keys)
  let result = re.exec(path)

  if (!result) {
    return false
  }

  return true
}

module.exports = {
  match
}
