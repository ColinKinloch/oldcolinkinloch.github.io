import _ from 'lodash'
import vertexShader from './post.glslv'

let PostCurry = (gl) => {
  let Shader = require('./shader.js')(gl)
  let ShaderProgram = require('./shaderprogram.js')(gl)
  let Texture2D = require('./texture2d.js')(gl)
  let Framebuffer = require('./framebuffer.js')(gl)

  let vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
    0, 0,
    0, 4,
    4, 0
  ]), gl.STATIC_DRAW)

  let Post = class {
    constructor (shader, o = {}) {
      _.defaults(this, o, {
        width: 1,
        height: 1,
        mag: gl.NEAREST,
        min: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        uniformLocations: {}
      })

      this.fragment = shader
      this.vertex = new Shader(gl.VERTEX_SHADER, vertexShader)
      this.program = new ShaderProgram([this.vertex, this.fragment])

      this.positionAttrib = this.program.getAttribLocation('position')

      this.frameUniform = this.program.getUniformLocation('frame')
      this.depthUniform = this.program.getUniformLocation('depth')

      this.sizeUniform = this.program.getUniformLocation('destSize')

      this.timeUniform = this.program.getUniformLocation('t')

      this.frame = new Framebuffer()

      this.depth = new Texture2D({
        type: gl.UNSIGNED_SHORT,
        format: gl.DEPTH_COMPONENT
      })
      this.texture = new Texture2D()

      this.frame.bind()

      this.resize(this.width, this.height)

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth.texture, 0)

      this.frame.check()

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.bindRenderbuffer(gl.RENDERBUFFER, null)
      gl.bindTexture(gl.TEXTURE_2D, null)
    }

    bind () {
      this.frame.bind()
      gl.viewport(0, 0, this.width, this.height)
    }

    draw (size = [32, 32], t = 0) {
      this.program.use()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.vertexAttribPointer(this.positionAttrib, 2, gl.UNSIGNED_BYTE, false, 0, 0)

      gl.uniform1f(this.timeUniform, t)
      gl.uniform1i(this.frameUniform, 0)
      gl.uniform1i(this.depthUniform, 1)

      gl.uniform2iv(this.sizeUniform, size)

      gl.activeTexture(gl.TEXTURE0 + 0)
      this.texture.bind()
      gl.activeTexture(gl.TEXTURE0 + 1)
      this.depth.bind()

      gl.viewport(0, 0, size[0], size[1])

      gl.enableVertexAttribArray(this.positionAttrib)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      gl.disableVertexAttribArray(this.positionAttrib)
      gl.bindTexture(gl.TEXTURE_2D, null)
    }

    resize (width, height) {
      this.width = width
      this.height = height
      gl.uniform2iv(this.sizeUniform, [width, height])
      this.depth.resize(width, height)
      this.texture.resize(width, height)
    }
  }
  return Post
}

module.exports = PostCurry
