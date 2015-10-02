import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import glm from 'gl-matrix'

class Entity {
  constructor (gl, material) {
    this.gl = gl
    this.material = material
    this.children = []

    this.arrayBuffers = {}
    this.buffers = {}
    this.attribs = {}
    this.uniforms = {}
    this.uniformLocations = {}
    this.attribLocations = {}

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

    gl.useProgram(this.material)

    this.attribLocations['position'] = gl.getAttribLocation(this.material, 'position')
    this.attribLocations['normal'] = gl.getAttribLocation(this.material, 'normal')

    this.uniformLocations['modelViewMatrix'] = gl.getUniformLocation(this.material, 'modelViewMatrix')
    this.uniformLocations['projectionMatrix'] = gl.getUniformLocation(this.material, 'projectionMatrix')
    this.uniformLocations['normalMatrix'] = gl.getUniformLocation(this.material, 'normalMatrix')
  }
  draw () {
    let gl = this.gl
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers['index'])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['vertex'])
    gl.vertexAttribPointer(this.attribLocations['position'], 3, gl.BYTE, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['normal'])
    gl.vertexAttribPointer(this.attribLocations['normal'], 3, gl.BYTE, false, 0, 0)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
  }
  static fromGLTF (path, options) {
    let gl = options.gl
    let entity = new Entity(gl, prog)
    let promises = []
    let loader = Object.create(glTFParser.glTFParser, {
      handleBuffer: {
        value: (id, desc) => {
          let req = new Request(desc.uri)
          let fetchPromise = fetch(req)
          promises.push(fetchPromise)
          fetchPromise.then((res) => {
            let bufferPromise = res.arrayBuffer()
            promises.push(bufferPromise)
            bufferPromise.then((buffer) => {
              entity.arrayBuffers[id] = buffer
            })
          })
          console.log(`Buffer "${id}":`, desc)
          return true
        }
      },
      handleLoadCompleted: {
        value: (success) => {
          if (success) {
            console.log('Loaded glTF!')
          } else {
            console.error('Failed to load glTF!')
            return
          }
          Promise.all(promises).then(() => {
            console.log('go!')
            // entity.setBuffer(resources.buffers[0])
          })
        }
      }
    })

    loader.initWithPath(path)
    loader.load()
    return entity
  }
}

export default Entity
