import glTFParser from '../lib/glTF/loaders/glTF-parser.js'

let glTFLoader = Object.create(glTFParser.glTFParser, {
  handleLoadCompleted: {
    value: (success) => {
      if (success) {
        console.log('Loaded glTF!')
      } else {
        console.error('Failed to load glTF!')
      }
    }
  },
  handleBuffer: {
    value: (id, desc, data) => {
      let req = new Request(desc.uri)
      let fetchPromise = fetch(req)
      data.promises.push(fetchPromise)
      fetchPromise.then((res) => {
        let bufferPromise = res.arrayBuffer()
        data.promises.push(bufferPromise)
        console.log(data)
        bufferPromise.then((buffer) => {
          data.buffers.push(buffer)
        })
      })
      console.log(`Buffer "${id}":`, desc)
      return true
    }
  },
  handleBufferView: {
    value: (id, desc, data) => {
      console.log(`BufferView "${id}"`, desc)
      return true
    }
  },
  handleShader: {
    value: (id, desc, data) => {
      console.log(`Shader "${id}":`, desc)
      return true
    }
  },
  handleProgram: {
    value: (id, desc, data) => {
      console.log(`Shader "${id}":`, desc)
      return true
    }
  },
  handleTechnique: {
    value: (id, desc, data) => {
      console.log(`Technique"${id}":`, desc)
      return true
    }
  },
  handleMaterial: {
    value: (id, desc, data) => {
      console.log(`Material "${id}":`, desc)
      return true
    }
  },
  handleMesh: {
    value: (id, desc, data) => {
      console.log(`Mesh "${id}":`, desc)
      return true
    }
  },
  handleCamera: {
    value: (id, desc, data) => {
      console.log(`Camera "${id}":`, desc)
      return true
    }
  },
  handleLight: {
    value: (id, desc, data) => {
      console.log(`Light "${id}":`, desc)
      return true
    }
  },
  handleNode: {
    value: (id, desc, data) => {
      console.log(`Node "${id}":`, desc)
      return true
    }
  },
  handleScene: {
    value: (id, desc, data) => {
      console.log(`Scene "${id}":`, desc)
      return true
    }
  },
  handleImage: {
    value: (id, desc, data) => {
      console.log(`Image "${id}":`, desc)
      return true
    }
  },
  handleAnimation: {
    value: (id, desc, data) => {
      console.log(`Animation "${id}":`, desc)
      return true
    }
  },
  handleAccessor: {
    value: (id, desc, data) => {
      console.log(`Accessor "${id}"`, desc)
      return true
    }
  },
  handleSkin: {
    value: (id, desc, data) => {
      console.log(`Skin "${id}"`, desc)
      return true
    }
  },
  handleSampler: {
    value: (id, desc, data) => {
      console.log(`Sampler "${id}"`, desc)
      return true
    }
  },
  handleTexture: {
    value: (id, desc, data) => {
      console.log(`Texture "${id}"`, desc)
      return true
    }
  },
  handleVideo: {
    value: (id, desc, data) => {
      console.log(`Video "${id}"`, desc)
      return true
    }
  }
})

export default glTFLoader
