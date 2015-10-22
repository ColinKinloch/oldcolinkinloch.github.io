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
      add(data, 'bufferView', id,
        get(data, 'buffer', desc.buffer)
        .then((arrayBuffer) => {
          return new Promise((res) => {
            let target
            switch (desc.target) {
              case 34962: { // ARRAY_BUFFER
                target = gl.ARRAY_BUFFER
                break
              }
              case 34963: { // ELEMENT_ARRAY_BUFFER
                target = gl.ELEMENT_ARRAY_BUFFER
                break
              }
            }
            let vbo = new Buffer({binding: target})
            vbo.bufferData(arrayBuffer.slice(desc.byteOffset, desc.byteOffset + desc.byteLength))
            res(vbo)
          })
        })
      )
      return true
    }
  },
  handleShader: {
    value: (id, desc, data) => {
      console.log(`Shader "${id}":`, desc)
      let req = new Request(desc.uri)
      add(data, 'shader', id,
        fetch(req)
        .then((res) => {
          return res.text()
        })
      )
      return true
    }
  },
  handleProgram: {
    value: (id, desc, data) => {
      console.log(`Program "${id}":`, desc)
      let vert = get(data, 'shader', desc.vertexShader)
      let frag = get(data, 'shader', desc.fragmentShader)
      add(data, 'program', id,
        Promise.all([vert, frag])
        .then((shaders) => {
          return new Promise((req) => {
            let vertShad = new Shader(gl.VERTEX_SHADER, shaders[0])
            let fragShad = new Shader(gl.FRAGMENT_SHADER, shaders[1])
            let program = new ShaderProgram([vertShad, fragShad])
            req(program)
          })
        })
      )
      return true
    }
  },
  handleTechnique: {
    value: (id, desc, data) => {
      console.log(`Technique "${id}":`, desc)
      get(data, 'program', desc.passes.defaultPass.instanceProgram.program)
      .then((program) => {
        console.log(program)
      }
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
