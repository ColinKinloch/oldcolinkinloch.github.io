import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import _ from 'lodash'

let add = (data, type, id, promise) => {
  if (!_.isObject(data.promises)) data.promises = {}
  _.defaultsDeep(data.promises,
    {
      [type]: {
        [id]: promise
      }
    }
  )
}
let get = (data, type, id) => {
  return data.promises[type][id]
}

let glTFLoader = Object.create(glTFParser.glTFParser, {
  handleBuffer: {
    value: (id, desc, data) => {
      console.log(`Buffer "${id}":`, desc)
      let req = new Request(desc.uri)
      // data.promises.push(fetchPromise)
      add(data, 'buffer', id,
        fetch(req)
        .then((res) => {
          return res.arrayBuffer()
        })
      )
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
  },
  handleLoadCompleted: {
    value: (success) => {
      if (success) {
        console.log('Loaded glTF!')
      } else {
        console.error('Failed to load glTF!')
      }
    }
  }
})

export {PromiseList}
export default glTFLoader
