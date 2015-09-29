import glTFLoader from './glTFLoader.js'

class Entity {
  constructor (gl) {
    this.gl = gl
    this.children = []
    this.buffer = null
    this.vertexBuffers = {}
  }
  setBuffer (buffer) {
    this.buffer = buffer
  }
  static fromGLTF (path) {
    let loader = Object.create(glTFLoader)
    let resources = {
      buffers: [],
      shaders: [],
      techniques: [],
      materials: [],
      meshs: [],
      promises: []
    }
    loader.initWithPath(path)
    loader.load(resources)
    let entity = new Entity()
    Promise.all(resources.promises).then(() => {
      console.log('go!')
      entity.setBuffer(resources.buffers[0])
    })
    return entity
  }
}

export default Entity
