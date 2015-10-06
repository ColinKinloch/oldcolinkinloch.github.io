import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import glm from 'gl-matrix'

let Entity = class {
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

    this.uniforms['normal'] = glm.mat3.create()
    this.uniforms['projection'] = glm.mat4.create()
    this.uniforms['modelView'] = glm.mat4.create()

    gl.useProgram(this.material)

    this.attribLocations['position'] = gl.getAttribLocation(this.material, 'position')
    this.attribLocations['normal'] = gl.getAttribLocation(this.material, 'normal')

    this.uniformLocations['modelView'] = gl.getUniformLocation(this.material, 'modelViewMatrix')
    this.uniformLocations['projection'] = gl.getUniformLocation(this.material, 'projectionMatrix')
    this.uniformLocations['normal'] = gl.getUniformLocation(this.material, 'normalMatrix')
  }
  draw (projection) {
    let t = (performance.timing.navigationStart + performance.now()) / 10000

    let mv = this.uniforms['modelView']
    glm.mat4.identity(mv)
    glm.mat4.translate(mv, mv, [0, 0, -8])
    glm.mat4.rotate(mv, mv, t * 10, [0.5, Math.tan(t) * 3, Math.sin(t)])
    glm.mat4.scale(mv, mv, [0.25, 3, 1.5])

    let normal = this.uniforms['normal']
    glm.mat3.normalFromMat4(normal, mv)

    this.uniforms['projection'] = projection

    let gl = this.gl

    gl.useProgram(this.material)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers['index'])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['vertex'])
    gl.vertexAttribPointer(this.attribLocations['position'], 3, gl.BYTE, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['normal'])
    gl.vertexAttribPointer(this.attribLocations['normal'], 3, gl.BYTE, false, 0, 0)

    gl.uniformMatrix3fv(this.uniformLocations['normal'], false, this.uniforms['normal'])
    gl.uniformMatrix4fv(this.uniformLocations['projection'], false, this.uniforms['projection'])
    gl.uniformMatrix4fv(this.uniformLocations['modelView'], false, this.uniforms['modelView'])

    gl.enableVertexAttribArray(this.attribLocations['vertex'])
    gl.enableVertexAttribArray(this.attribLocations['normal'])

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)

    gl.disableVertexAttribArray(this.attribLocations['normal'])
    gl.disableVertexAttribArray(this.attribLocations['vertex'])
  }
  static fromGLTF (path, options) {
    let gl = options.gl
    let entity = new Entity(gl, options.material)
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
