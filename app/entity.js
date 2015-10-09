import _ from 'lodash'
import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import glm from 'gl-matrix'
import ShaderCurry from './gl/shader.js'
import ShaderProgramCurry from './gl/shaderprogram.js'

let Entity = class {
  constructor (gl, material) {
    this.gl = gl
    this.material = material
    this.children = []

    this.arrayBuffers = {}
    this.dataViews = {}
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

    this.material.use()

    this.attribLocations['position'] = this.material.getAttribLocation('position')
    this.attribLocations['normal'] = this.material.getAttribLocation('normal')

    this.uniformLocations['modelView'] = this.material.getUniformLocation('modelViewMatrix')
    this.uniformLocations['projection'] = this.material.getUniformLocation('projectionMatrix')
    this.uniformLocations['normal'] = this.material.getUniformLocation('normalMatrix')
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

    this.material.use()
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
    let promises = {
    }
    let keyer = (type, id) => {
      return type + id
    }
    let add = (type, id, promise) => {
      let key = keyer(type, id)
      promises[key] = promise
    }
    let get = (type, id) => {
      let key = keyer(type, id)
      return promises[key]
    }
    let loader = Object.create(glTFParser.glTFParser, {
      handleBuffer: {
        value: (id, desc) => {
          console.log(`Buffer "${id}":`, desc)
          let req = new Request(desc.uri)
          let fetchPromise = fetch(req)
          add('buffer', id,
            fetchPromise.then((res) => {
              console.log('Got .bin', id)
              return res.arrayBuffer()
            }).then((buffer) => {
              console.log('.bin to ArrayBuffer', id)
              entity.arrayBuffers[id] = buffer
              return new Promise((res) =>
                res(buffer)
              )
            })
          )
          return true
        }
      },
      handleBufferView: {
        value: (id, desc) => {
          console.log(`BufferView "${id}"`, desc)
          let bufferViewPromise = get('buffer', desc.buffer)
          bufferViewPromise.then((arrayBuffer) => {
            console.log('Create DataView', id)
            entity.dataViews[id] = new DataView(
              arrayBuffer,
              desc.byteOffset,
              desc.byteLength
            )
          })
          return true
        }
      },
      handleShader: {
        value: (id, desc) => {
          console.log(`Shader "${id}"`, desc)
          let req = new Request(desc.uri)
          let fetchPromise = fetch(req)
          add('shader', id,
            fetchPromise.then((res) => {
              return res.text()
            })
          )
          return true
        }
      },
      handleProgram: {
        value: (id, desc) => {
          console.log(`Program "${id}"`, desc)
          let vert = get('shader', desc.vertexShader)
          let frag = get('shader', desc.fragmentShader)
          add('program', id,
            Promise.all([vert, frag])
            .then((shaders) => {
              /*
              let vertShad = new Shader(gl.VERTEX_SHADER, shaders[0])
              let fragShad = new Shader(gl.FRAGMENT_SHADER, shaders[1])
              let program = new ShaderProgram([vertShad, fragShad])
              */
            })
          )
        }
      },
      handleScene: {
        value: (id, desc) => {
          console.log(`Scene "${id}"`, desc)
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
          console.log('Waiting for', _(promises).values().flatten().value())
          Promise.all(_(promises).values().flatten().value()).then(() => {
            console.log('DONE!')
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
