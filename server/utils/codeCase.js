function urlCase (str) {
  return str.replace(/\/([a-zA-Z])/g, w => {
    return w.substring(1, 2).toUpperCase() + w.substring(2)
  })
}

function camelCase (str) {
  return str.replace(/\/([a-zA-Z])/g, w => {
    return w.substring(1, 2).toUpperCase() + w.substring(2)
  })
}

module.exports = {
  urlCase,
  camelCase
}
