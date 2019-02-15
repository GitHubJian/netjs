const { before, after } = require('./../hooks/index.js')

async function build () {
  const buildDll = require('./../build/dll.js')
  await buildDll()
  await before()
  const buildServer = require('./../build/server.js')
  await buildServer()
  const buildClient = require('./../build/client.js')
  await buildClient()
  await after()
}

module.exports = build
