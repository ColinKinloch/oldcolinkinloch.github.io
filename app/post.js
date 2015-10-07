import _ from 'lodash'

import vertexShader from './post.glslv'
import Shader from './shader.js'
import ShaderProgram from './shaderprogram.js'
import Texture from './texture.js'

class Post {
  constructor (gl, shader, o = {}) {
    _.defaults(this, o, {
      width: 1,
      height: 1,
      mag: gl.NEAREST,
      min: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      uniformLocations: {}
    })
    this.gl = gl

    this.fragment = shader
    this.vertex = new Shader(gl, gl.VERTEX_SHADER, vertexShader)
    this.program = new ShaderProgram(gl, [this.vertex, this.fragment])

    this.positionAttrib = this.program.getAttribLocation('position')

    this.frameUniform = this.program.getUniformLocation('frame')
    this.depthUniform = this.program.getUniformLocation('depth')

    this.timeUniform = this.program.getUniformLocation('t')

    this.frame = gl.createFramebuffer()

    this.depth = new Texture(gl, {
      type: gl.UNSIGNED_SHORT,
      format: gl.DEPTH_COMPONENT
    })
    this.texture = new Texture(gl)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frame)

    this.resize(this.width, this.height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth.texture, 0)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('framebuffer incomplete')
      return null
    }

    if (!this.contextData.has(gl)) {
      let vb = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vb)
      gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
        0, 0,
        0, 4,
        4, 0
      ]), gl.STATIC_DRAW)

      this.data = {
        vertexBuffer: vb
      }
      this.contextData.set(gl, this.data)
    } else {
      this.data = this.contextData.get(gl)
    }
  }

  bind () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame)
  }

  draw (t = 0) {
    let gl = this.gl
    this.program.use()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.data.vertexBuffer)
    gl.vertexAttribPointer(this.positionAttrib, 2, gl.UNSIGNED_BYTE, false, 0, 0)
    this.texture.bind()

    gl.uniform1f(this.timeUniform, t)
    gl.uniform1i(this.frameUniform, 0)
    gl.uniform1i(this.depthUniform, 2)

    gl.activeTexture(gl.TEXTURE0 + 0)
    this.texture.bind()
    gl.activeTexture(gl.TEXTURE0 + 2)
    this.depth.bind()

    gl.enableVertexAttribArray(this.positionAttrib)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.disableVertexAttribArray(this.positionAttrib)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  resize (width, height) {
    this.width = width
    this.height = height
    this.depth.resize(width, height)
    this.texture.resize(width, height)
  }
}
Post.prototype.contextData = new Map()

module.exports = Post
