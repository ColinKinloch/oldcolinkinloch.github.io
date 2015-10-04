document.querySelector('#year').innerHTML = new Date().getYear()

import Q from 'q'
require('q-xhr')(XMLHttpRequest, Q)

import glm from 'gl-matrix'

import glTFLoader from './glTFLoader.js'

import Entity from './entity.js'
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

let shad = function (type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    let s = source.split('\n')
    source = ''
    let i = 0
    for (let l of s) {
      i++
      source += `${i}:${l}\n`
    }
    console.error(source)
    return null
  }
  return shader
}

let blurFragSrc = require('./gaussianBlur.glslf')
let blurFrag = shad(gl.FRAGMENT_SHADER, blurFragSrc)
let blur = new Post(gl, blurFrag)

let ditherFragSrc = require('./dithering.glslf')
let ditherFrag = shad(gl.FRAGMENT_SHADER, ditherFragSrc)
let dither = new Post(gl, ditherFrag)

let deresFragSrc = require('./deres.glslf')
let deresFrag = shad(gl.FRAGMENT_SHADER, deresFragSrc)
let deres = new Post(gl, deresFrag)

let motionBlurSrc = require('./shadeDepth.glslf')
let motionBlurFrag = shad(gl.FRAGMENT_SHADER, motionBlurSrc)
let motionBlur = new Post(gl, motionBlurFrag)

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
  motionBlur.resize(w, h)
}

window.addEventListener('resize', function (e) {
  resize(e.target.innerWidth, e.target.innerHeight)
})
window.dispatchEvent(new Event('resize'))

let vertShad = shad(gl.VERTEX_SHADER, vert)
let fragShad = shad(gl.FRAGMENT_SHADER, frag)

let prog = gl.createProgram()
gl.attachShader(prog, vertShad)
gl.attachShader(prog, fragShad)
gl.linkProgram(prog)

let f = './box.gltf'

let entity = Entity.fromGLTF(f, {
  gl: gl,
  material: prog
})

let draw = function () {
  requestAnimationFrame(draw)

  let t = performance.now() / 10000
  let t2 = (t * 100) % 1
  let t3 = 1 / Math.cos(t * 0.3)

  motionBlur.bind()

  entity.draw(projection)

  dither.bind()
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  motionBlur.draw()

  // blur.bind()
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  dither.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))

  /* gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  blur.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  motionBlur.draw() */
}

draw()
