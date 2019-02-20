function Module(metadata) {
  const propsKeys = Object.keys(metadata)

  return target => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        console.log(property)
        Reflect.defineProperty(target, property, metadata[property])
      }
    }
  }
}

function Controller(){
  
}

exports.Module = Module
