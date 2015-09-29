import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import Q from 'q'
require('q-xhr')(XMLHttpRequest, Q)

let glTFLoader = Object.create(glTFParser.glTFParser, {
  handleLoadCompleted: {
    value: () => {
      console.log('Loaded glTF!')
    }
  },
  handleBuffer: {
    value: (id, des, data) => {
      Q.xhr.get(des.uri, {
        responseType: 'arraybuffer'
      }).then((res) => {
        data.object.buffer = res.data
      })
      console.log(`Buffer "${id}":`, des)
      return true
    }
  },
  handleImage: {
    value: (id, des, data) => {
      console.log(`Image "${id}":`, des)
      return true
    }
  },
  handleShader: {
    value: (id, des, data) => {
      console.log(`Shader "${id}":`, des)
      return true
    }
  },
  handleTechnique: {
    value: (id, des, data) => {
      console.log(`Technique"${id}":`, des)
      return true
    }
  },
  handleMaterial: {
    value: (id, des, data) => {
      console.log(`Material "${id}":`, des)
      return true
    }
  },
  handleLight: {
    value: (id, des, data) => {
      console.log(`Light "${id}":`, des)
      return true
    }
  },
  handleMesh: {
    value: (id, des, data) => {
      console.log(`Mesh "${id}":`, des)
      return true
    }
  },
  handleCamera: {
    value: (id, des, data) => {
      console.log(`Camera "${id}":`, des)
      return true
    }
  },
  handleScene: {
    value: (id, des, data) => {
      console.log(`Scene "${id}":`, des)
      return true
    }
  },
  handleNode: {
    value: (id, des, data) => {
      console.log(`Node "${id}":`, des)
      return true
    }
  }
})

export default glTFLoader
