import _ from 'lodash'
import glTFParser from '../lib/glTF/loaders/glTF-parser.js'
import glm from 'gl-matrix'
import ShaderCurry from './gl/shader.js'
import ShaderProgramCurry from './gl/shaderprogram.js'
import BufferCurry from './gl/buffer.js'

let EntityCurry = (gl) => {
  let Shader = ShaderCurry(gl)
  let ShaderProgram = ShaderProgramCurry(gl)
  let Buffer = BufferCurry(gl)

  let Entity = class {
    constructor (material) {
      this.material = material
      this.children = []

      this.arrayBuffers = {}
      this.dataViews = {}
      this.buffers = {}
      this.attribs = {}
      this.uniforms = {}
      this.uniformLocations = {}
      this.attribLocations = {}

      this.buffers['position'] = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['position'])
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
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
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
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
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
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
      glm.mat4.translate(mv, mv, [0, 0, -5])
      glm.mat4.rotate(mv, mv, t * 10, [0.5, Math.tan(t) * 3, Math.sin(t)])
      // glm.mat4.scale(mv, mv, [0.25, 3, 1.5])

      let normal = this.uniforms['normal']
      glm.mat3.normalFromMat4(normal, mv)

      this.uniforms['projection'] = projection

      this.material.use()
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers['index'])
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['position'])
      gl.vertexAttribPointer(this.attribLocations['position'], 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers['normal'])
      gl.vertexAttribPointer(this.attribLocations['normal'], 3, gl.FLOAT, false, 0, 0)

      gl.uniformMatrix3fv(this.uniformLocations['normal'], false, this.uniforms['normal'])
      gl.uniformMatrix4fv(this.uniformLocations['projection'], false, this.uniforms['projection'])
      gl.uniformMatrix4fv(this.uniformLocations['modelView'], false, this.uniforms['modelView'])

      gl.enableVertexAttribArray(this.attribLocations['position'])
      gl.enableVertexAttribArray(this.attribLocations['normal'])

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

      gl.disableVertexAttribArray(this.attribLocations['normal'])
      gl.disableVertexAttribArray(this.attribLocations['position'])
    }
    static fromGLTF (path, options) {
      let entity = new Entity(options.material)
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
            add('bufferView', id,
              bufferViewPromise.then((arrayBuffer) => {
                console.log('Create DataView', id)
                return new Promise((res) => {
                  res({buffer: arrayBuffer})
                  /*res(new DataView(
                      arrayBuffer,
                      desc.byteOffset,
                      desc.byteLength
                    )
                  )*/
                })
              })
            )
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
                // TODO Implement attributes
                // entity.material = program
                return new Promise((req) => {
                  let vertShad = new Shader(gl.VERTEX_SHADER, shaders[0])
                  let fragShad = new Shader(gl.FRAGMENT_SHADER, shaders[1])
                  let program = new ShaderProgram([vertShad, fragShad])
                  req(program)
                })
              })
            )
          }
        },
        handleTechnique: {
          value: (id, desc) => {
            console.log(`Technique "${id}"`, desc)
            get('program', desc.passes.defaultPass.instanceProgram.program)
            .then((program) =>
              console.log(program)
            )
            return true
          }
        },
        handleMaterial: {
          value: (id, desc) => {
            console.log(`Material "${id}"`, desc)
            return true
          }
        },
        handleMesh: {
          value: (id, desc) => {
            console.log(`Mesh "${id}"`, desc)
            for (let prim of desc.primitives) {
              get('accessor', prim.indices)
              .then((accessor) => {
                let idBuff = entity.buffers['index'] = gl.createBuffer()
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idBuff)
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, accessor, gl.STATIC_DRAW)
              })
              get('accessor', prim.attributes.POSITION)
              .then((accessor) => {
                let posBuff = entity.buffers['position'] = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, posBuff)
                gl.bufferData(gl.ARRAY_BUFFER, accessor, gl.STATIC_DRAW)
              })
              get('accessor', prim.attributes.NORMAL)
              .then((accessor) => {
                let posBuff = entity.buffers['normal'] = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, posBuff)
                gl.bufferData(gl.ARRAY_BUFFER, accessor, gl.STATIC_DRAW)
              })
            }
            return true
          }
        },
        handleNode: {
          value: (id, desc) => {
            console.log(`Node "${id}"`, desc)
          }
        },
        handleScene: {
          value: (id, desc) => {
            console.log(`Scene "${id}"`, desc)
            return true
          }
        },
        handleAccessor: {
          value: (id, desc) => {
            console.log(`Accessor "${id}"`, desc)
            add('accessor', id,
              get('bufferView', desc.bufferView)
              .then((data) => {
                return new Promise((res, rej) => {
                  switch (desc.componentType) {
                    case 5120: { // BYTE
                      res(new Int8Array(data.buffer, desc.byteOffset))
                      break
                    }
                    case 5121: { // UNSIGNED_BYTE
                      res(new Uint8Array(data.buffer, desc.byteOffset))
                      break
                    }
                    case 5122: { // SHORT
                      res(new Int16Array(data.buffer, desc.byteOffset))
                      break
                    }
                    case 5123: { // UNSIGNED_SHORT
                      res(new Uint16Array(data.buffer, desc.byteOffset))
                      break
                    }
                    case 5126: { // FLOAT
                      console.log('hoo')
                      res(new Float32Array(data.buffer, desc.byteOffset))
                      break
                    }
                    default: {
                      console.error('unknown')
                      rej()
                    }
                  }
                })
              })
            )
            return true
          }
        },
        handleLoadCompleted: {
          value: (success) => {
            console.log(loader._json)
            if (success) {
              console.log('Loaded glTF!')
            } else {
              console.error('Failed to load glTF!')
              return
            }
            console.log('Waiting for', _(promises).values().flatten().value())
            Promise.all(_(promises).values().flatten().value()).then(() => {
              console.log('DONE!')
              console.timeEnd(`Loading glTF: ${path}`)
              console.groupEnd()
              if (success) console.log('Success')
              // entity.setBuffer(resources.buffers[0])
            })
          }
        }
      })

      loader.initWithPath(path)
      console.groupCollapsed('Load glTF')
      console.time(`Loading glTF: ${path}`)
      loader.load()
      return entity
    }
  }
  return Entity
}

export default EntityCurry
