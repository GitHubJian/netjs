function Module(metadata) {
  return target => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineProperty(target, property, { value: metadata[property] })
      }
    }
  }
}

exports.Module = Module
