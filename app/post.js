import _ from 'lodash'

import vertexShader from './post.glslv'

class Post {
  constructor (gl, shader, o = {}) {
    _.defaults(this, o, {
      width: 1,
      height: 1,
      mag: gl.NEAREST,
      min: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      uniforms: {},
      uniformLocations: {}
    })
    this.gl = gl
    this.ext = {
      depthTexture: gl.getExtension('WEBGL_depth_texture'),
      drawBuffers: gl.getExtension('WEBGL_draw_buffers')
    }

    this.fragment = shader
    this.vertex = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(this.vertex, vertexShader)
    gl.compileShader(this.vertex)
    if (!gl.getShaderParameter(this.vertex, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(this.vertex))
      return null
    }
    this.program = gl.createProgram()
    gl.attachShader(this.program, this.vertex)
    gl.attachShader(this.program, this.fragment)
    gl.linkProgram(this.program)

    this.positionAttrib = gl.getAttribLocation(this.program, 'position')

    this.frameUniform = gl.getUniformLocation(this.program, 'frame')
    this.depthUniform = gl.getUniformLocation(this.program, 'depth')

    this.timeUniform = gl.getUniformLocation(this.program, 't')

    this.frame = gl.createFramebuffer()
    this.depth = gl.createTexture()
    this.texture = gl.createTexture()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frame)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.mag)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.min)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT)

    gl.bindTexture(gl.TEXTURE_2D, this.depth)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.mag)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.min)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT)

    this.resize(this.width, this.height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth, 0)

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

    for (let u in this.uniforms) {
      this.uniformLocations[u] = gl.getUniformLocation(this.program, u)
    }
  }

  bind () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame)
  }

  draw (t = 0) {
    let gl = this.gl
    gl.useProgram(this.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.data.vertexBuffer)
    gl.vertexAttribPointer(this.positionAttrib, 2, gl.UNSIGNED_BYTE, false, 0, 0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    for (let u in this.uniforms) {
      let uniform = this.uniforms[u]
      if (uniform.value instanceof Array) {
        switch (uniform.type) {
          case 'f':
          case 'i':
            gl['uniform' + uniform.value.length + 'v' + uniform.type](this.uniformLocations[u])
        }
      }
    }

    gl.uniform1f(this.timeUniform, t)
    gl.uniform1i(this.frameUniform, 0)
    gl.uniform1i(this.depthUniform, 2)

    gl.activeTexture(gl.TEXTURE0 + 0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.activeTexture(gl.TEXTURE0 + 2)
    gl.bindTexture(gl.TEXTURE_2D, this.depth)

    gl.enableVertexAttribArray(this.positionAttrib)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.disableVertexAttribArray(this.positionAttrib)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  resize (width, height) {
    let gl = this.gl
    this.width = width
    this.height = height
    gl.bindTexture(gl.TEXTURE_2D, this.depth)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
Post.prototype.contextData = new Map()

module.exports = Post
