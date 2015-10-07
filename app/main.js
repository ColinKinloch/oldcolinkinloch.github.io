document.querySelector('#year').innerHTML = new Date().getYear()

import _ from 'lodash'
import glm from 'gl-matrix'

import Entity from './entity.js'
import Shader from './shader.js'
import ShaderProgram from './shaderprogram.js'
import Post from './post.js'

import vert from './main.glslv'
import frag from './main.glslf'

let projection = glm.mat4.create()

let el = document.querySelector('#main')
let glopts = {
  antialias: false,
  alpha: true
}
let gl =
el.getContext('webgl2', glopts) ||
el.getContext('experimental-webgl2', glopts) ||
el.getContext('webgl', glopts) ||
el.getContext('experimental-webgl', glopts)
gl.enable(gl.DEPTH_TEST)
gl.clearColor(0, 0, 0, 0)
gl.clearDepth(1)
window.gl = gl

let buffFragSrc = require('./bufferDraw.glslf')
let buffFrag = new Shader(gl, gl.FRAGMENT_SHADER, buffFragSrc)

// let buff = new ShaderProgram(gl, [buffFrag])

let color = [
  gl.createTexture(),
  gl.createTexture(),
  gl.createTexture()
]
let colorAttachment = [
  gl.COLOR_ATTACHMENT0,
  gl.COLOR_ATTACHMENT1,
  gl.COLOR_ATTACHMENT2,
  gl.COLOR_ATTACHMENT3,
  gl.COLOR_ATTACHMENT4,
  gl.COLOR_ATTACHMENT5,
  gl.COLOR_ATTACHMENT6,
  gl.COLOR_ATTACHMENT7,
  gl.COLOR_ATTACHMENT8,
  gl.COLOR_ATTACHMENT9,
  gl.COLOR_ATTACHMENT10,
  gl.COLOR_ATTACHMENT11,
  gl.COLOR_ATTACHMENT12,
  gl.COLOR_ATTACHMENT13,
  gl.COLOR_ATTACHMENT14,
  gl.COLOR_ATTACHMENT15
]
/* let drawBuffer = [
  gl.DRAW_BUFFER0,
  gl.DRAW_BUFFER1,
  gl.DRAW_BUFFER2,
  gl.DRAW_BUFFER3,
  gl.DRAW_BUFFER4,
  gl.DRAW_BUFFER5,
  gl.DRAW_BUFFER6,
  gl.DRAW_BUFFER7,
  gl.DRAW_BUFFER8,
  gl.DRAW_BUFFER9,
  gl.DRAW_BUFFER10,
  gl.DRAW_BUFFER11,
  gl.DRAW_BUFFER12,
  gl.DRAW_BUFFER13,
  gl.DRAW_BUFFER14,
  gl.DRAW_BUFFER15
] */

for (let c of color) {
  gl.bindTexture(gl.TEXTURE_2D, c)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

let frame = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, frame)
for (let i in color) {
  gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment[i], gl.TEXTURE_2D, color[i], 0)
}
let buffResize = (width, height) => {
  for (let c of color) {
    gl.bindTexture(gl.TEXTURE_2D, c)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  }
}

let blurFragSrc = require('./gaussianBlur.glslf')
let blurFrag = new Shader(gl, gl.FRAGMENT_SHADER, blurFragSrc)
let blur = new Post(gl, blurFrag)

let ditherFragSrc = require('./dithering.glslf')
let ditherFrag = new Shader(gl, gl.FRAGMENT_SHADER, ditherFragSrc)
let dither = new Post(gl, ditherFrag)

let deresFragSrc = require('./deres.glslf')
let deresFrag = new Shader(gl, gl.FRAGMENT_SHADER, deresFragSrc)
let deres = new Post(gl, deresFrag)

let depthFragSrc = require('./shadeDepth.glslf')
let depthFrag = new Shader(gl, gl.FRAGMENT_SHADER, depthFragSrc)
let depth = new Post(gl, depthFrag)

if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.log('framebuffer incomplete')
}

let resize = function (w, h) {
  el.width = w
  el.height = h
  gl.viewport(0, 0, w, h)
  glm.mat4.perspective(projection, 45, w / h, 3, 11)
  // glm.mat4.ortho(projection, -5, 5, -5, 5, -10, 10)
  deres.resize(w, h)
  dither.resize(w, h)
  blur.resize(w, h)
  depth.resize(w, h)
  buffResize(w, h)
}

window.addEventListener('resize', function (e) {
  resize(e.target.innerWidth, e.target.innerHeight)
})
window.dispatchEvent(new Event('resize'))

let vertShad = new Shader(gl, gl.VERTEX_SHADER, vert)
let fragShad = new Shader(gl, gl.FRAGMENT_SHADER, frag)

let prog = new ShaderProgram(gl, [vertShad, fragShad])

let f = './box.gltf'

let entity = Entity.fromGLTF(f, {
  gl: gl,
  material: prog
})

let rafId = 0
let draw = function () {
  rafId = requestAnimationFrame(draw)

  let t = performance.timing.navigationStart + performance.now() / 10000
  let t2 = (t * 100) % 1
  let t3 = 1 / Math.cos(t * 0.3)
  // gl.clearColor((t, 0, 0, 0)

  depth.bind()

  entity.draw(projection)

  dither.bind()
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  depth.draw()

  /* gl.bindFramebuffer(gl.FRAMEBUFFER, frame)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  dither.draw() */

  // gl.bindFramebuffer(gl.FRAMEBUFFER, frame)
  // gl.useProgram(buff)
  /* for (let i in color) {
    gl.clearBufferfv(gl.COLOR, colorAttachment[i], [1.0, 0.0, 1.0, 1.0])
  } */
  // gl.clearBufferfv(gl.FRAMEBUFFER, null, [1, 0, 1, 1])
  // gl.clearBufferfv(gl.COLOR, null, [1.0, 0.0, 1.0, 1.0])
  // gl.bindFramebuffer(gl.COLOR_ATTACHMENT0)

  // gl.drawBuffers(colorAttachment.slice(0, color.length))

  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  /* gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  depth.draw() */

  // blur.bind()
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  // buff.use()
  // gl.drawBuffers(colorAttachment.slice(0, color.length))
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // let temp = _.pick(depth, ['frame', 'texture', 'depth'])
  // depth.frame = frame
  // depth.texture = color[0]
  // depth.depth = color[1]
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  dither.draw()
  // _.extend(depth, temp)
  // dither.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))

  /* gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  blur.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  depth.draw() */
  if (paused) {
    cancelAnimationFrame(rafId)
  }
}

let paused = false
window.addEventListener('keypress', (e) => {
  console.log(e)
  if (e.repeat) {
  } else {
    switch (e.code) {
      case 'Space': {
        paused = !paused
      }
    }
  }
  if (!paused) {
    draw()
  }
})

draw()
