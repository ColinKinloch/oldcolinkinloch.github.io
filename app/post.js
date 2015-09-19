let _ = require('lodash')
let vertexShader = require('./post.glslv')

class Post {
  constructor(gl, shader, o = {}) {
    this.options = o
    _.defaults(this.options, {
      width: 1,
      height: 1,
      mag: gl.NEAREST,
      min: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    })
    this.gl = gl

    this.fragment = shader
    this.vertex = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(this.vertex, vertexShader)
    gl.compileShader(this.vertex)
    if(!gl.getShaderParameter(this.vertex, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(this.vertex))
      return null
    }
    this.program = gl.createProgram()
    gl.attachShader(this.program, this.vertex)
    gl.attachShader(this.program, this.fragment)
    gl.linkProgram(this.program)

    this.positionAttrib = gl.getAttribLocation(this.program, 'position')

    this.frameUniform = gl.getUniformLocation(this.program, 'frame')
    this.timeUniform = gl.getUniformLocation(this.program, 't')

    this.frame = gl.createFramebuffer()
    this.depth = gl.createRenderbuffer()
    this.texture = gl.createTexture()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frame)
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, o.mag)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, o.min)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o.wrapT)

    this.resize(o.width, o.height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depth)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('framebuffer incomplete')
      return null
    }

    if(!this.contextData.has(gl)) {
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

    }
    else {
      this.data = this.contextData.get(gl)
    }
  }
  bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame)

  }
  draw(t = 0) {
    let gl = this.gl
    gl.useProgram(this.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.data.vertexBuffer)
    gl.vertexAttribPointer(this.positionAttrib, 2, gl.UNSIGNED_BYTE, false, 0, 0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.uniform1f(this.timeUniform, t)
    gl.enableVertexAttribArray(this.positionAttrib)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.disableVertexAttribArray(this.positionAttrib)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
  resize(width, height) {
    let o = this.options
    o.width = width
    o.height = height
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, o.width, o.height)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, o.width, o.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
Post.prototype.contextData = new Map()

module.exports = Post
