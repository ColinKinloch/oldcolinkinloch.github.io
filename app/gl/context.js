import _ from 'lodash'

import Texture2D from './texture2d.js'
import Shader from './shader.js'
import ShaderProgram from './shaderprogram.js'
import Framebuffer from './framebuffer.js'
import Post from './post.js'

let Context = class {
  constructor (el, opts = {}) {
    this.el = el

    _.defaults(this, opts,
      {
        options: {
          antialias: false,
          alpha: true
        },
        extensions: [
          'WEBGL_draw_buffers'
        ]
      }
    )

    this.extension = {}

    this.createContext()
    this.createExtensions()
    let gl = this.gl
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 0)
    gl.clearDepth(1)

    this.Texture2D = Texture2D(gl)
    this.Shader = Shader(gl)
    this.ShaderProgram = ShaderProgram(gl)
    this.Framebuffer = Framebuffer(gl)
    this.Post = Post(gl)
  }
  createContext () {
    let exp = 'experimental-'
    let wgl = 'webgl'
    let el = this.el

    this.gl = el.getContext(wgl + 2, this.options) ||
    el.getContext(exp + wgl + 2, this.options) ||
    el.getContext(wgl, this.options) ||
    el.getContext(exp + wgl, this.options)
  }
  createExtensions () {
    let gl = this.gl
    for (let ext of this.extensions) {
      this.extension[ext] = gl.getExtension(ext)
      console.log(this.extension[ext])
    }
  }
}

export default Context
