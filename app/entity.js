import glTFLoader from './glTFLoader.js'
import glm from 'gl-matrix'

class Entity {
  constructor (gl) {
    this.gl = gl
    this.children = []
    this.buffer = null

    this.buffers = {}
    this.uniforms = {}

    this.buffers['vertex'] = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['vertex'])
    gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
      1, 1, 1,
      -1, 1, 1,
      -1, 1, -1,
      1, 1, -1,
      1, -1, -1,
      -1, -1, -1,
      -1, -1, 1,
      1, -1, 1,
      1, 1, 1,
      1, 1, -1,
      1, -1, -1,
      1, -1, 1,
      -1, 1, 1,
      -1, 1, -1,
      -1, -1, -1,
      -1, -1, 1,
      1, 1, 1,
      -1, 1, 1,
      -1, -1, 1,
      1, -1, 1,
      1, -1, -1,
      -1, -1, -1,
      -1, 1, -1,
      1, 1, -1
    ]), gl.STATIC_DRAW)

    this.buffers['normal'] = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['normal'])
    gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
    ]), gl.STATIC_DRAW)

    this.buffers['index'] = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers['index'])
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
      // Top
      0, 1, 2,
      0, 2, 3,
      // Bottom
      4, 5, 6,
      4, 6, 7,
      // Left
      8, 9, 10,
      8, 10, 11,
      // Right
      12, 13, 14,
      12, 14, 15,
      // Front
      16, 17, 18,
      16, 18, 19,
      // Back
      20, 21, 22,
      20, 22, 23
    ]), gl.STATIC_DRAW)
  }
  setBuffer (buffer) {
    this.buffer = buffer
  }
  draw () {
    let gl = this.gl
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers['index'])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['vertex'])
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
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
