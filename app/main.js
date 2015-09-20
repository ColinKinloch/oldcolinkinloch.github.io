document.querySelector('#year').innerHTML = new Date().getYear()

let glm = require('gl-matrix')

let Post = require('./post.js')

let vert = require('./main.glslv')
let frag = require('./main.glslf')

let normal = glm.mat3.create()
let mv = glm.mat4.create()
let proj = glm.mat4.create()

let el = document.querySelector('#main')
let glopts = {
  antialias: false,
  alpha: true
}
let gl = el.getContext('webgl2', glopts) || el.getContext('experimental-webgl2', glopts)
gl.enable(gl.DEPTH_TEST)
gl.clearColor(0,0,0,0)
gl.clearDepth(1)
window.gl = gl

let shad = function(type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    let s = source.split('\n')
    source = ''
    let i = 0
    for(let l of s) {
      i++
      source += `${i}:${l}\n`
    }
    console.error(source)
    return null
  }
  return shader
}

let ditherFragSrc = require('./dithering.glslf')
let ditherFrag = shad(gl.FRAGMENT_SHADER, ditherFragSrc)
let dither = new Post(gl, ditherFrag)

let fragPost = require('./deres.glslf')
let fragPostShad = shad(gl.FRAGMENT_SHADER, fragPost)
let deres = new Post(gl, fragPostShad)

if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.log('framebuffer incomplete')
}

let resize = function (w, h)
{
  el.width = w
  el.height = h
  gl.viewport(0, 0, w, h)
  glm.mat4.perspective(proj, 45, w / h, 3, 11)
  //glm.mat4.ortho(proj, -5, 5, -5, 5, -10, 10)
  deres.resize(w,h)
  dither.resize(w,h)
}

window.addEventListener('resize', function(e) {
  resize(e.target.innerWidth, e.target.innerHeight)
})
window.dispatchEvent(new Event('resize'))

let vertShad = shad(gl.VERTEX_SHADER, vert)
let fragShad = shad(gl.FRAGMENT_SHADER, frag)

let prog = gl.createProgram()
gl.attachShader(prog, vertShad)
gl.attachShader(prog, fragShad)
gl.linkProgram(prog)

gl.useProgram(prog)
let vAttr = gl.getAttribLocation(prog, 'position')
let nAttr = gl.getAttribLocation(prog, 'normal')

let mvUni = gl.getUniformLocation(prog, 'modelViewMatrix')
let projUni = gl.getUniformLocation(prog, 'projectionMatrix')
let normalUni = gl.getUniformLocation(prog, 'normalMatrix')

let vBuff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vBuff)
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
   1,  1,  1,//00
  -1,  1,  1,//01
  -1,  1, -1,//02
   1,  1, -1,//03
   1, -1, -1,//04
  -1, -1, -1,//05
  -1, -1,  1,//06
   1, -1,  1,//07
   1,  1,  1,//08
   1,  1, -1,//09
   1, -1, -1,//10
   1, -1,  1,//11
  -1,  1,  1,//12
  -1,  1, -1,//13
  -1, -1, -1,//14
  -1, -1,  1,//15
   1,  1,  1,//16
  -1,  1,  1,//17
  -1, -1,  1,//18
   1, -1,  1,//19
   1, -1, -1,//20
  -1, -1, -1,//21
  -1,  1, -1,//22
   1,  1, -1 //23
]), gl.STATIC_DRAW)

let nBuff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, nBuff)
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
   0,  1,  0,//00
   0,  1,  0,//01
   0,  1,  0,//02
   0,  1,  0,//03
   0, -1,  0,//04
   0, -1,  0,//05
   0, -1,  0,//06
   0, -1,  0,//07
   1,  0,  0,//08
   1,  0,  0,//09
   1,  0,  0,//10
   1,  0,  0,//11
  -1,  0,  0,//12
  -1,  0,  0,//13
  -1,  0,  0,//14
  -1,  0,  0,//15
   0,  0,  1,//16
   0,  0,  1,//17
   0,  0,  1,//18
   0,  0,  1,//19
   0,  0, -1,//20
   0,  0, -1,//21
   0,  0, -1,//22
   0,  0, -1 //23
]), gl.STATIC_DRAW)


let iBuff = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
  //Top
  0, 1, 2,
  0, 2, 3,
  //Bottom
  4, 5, 6,
  4, 6, 7,
  //Left
  8, 9, 10,
  8, 10, 11,
  //Right
  12, 13, 14,
  12, 14, 15,
  //Front
  16, 17, 18,
  16, 18, 19,
  //Back
  20, 21, 22,
  20, 22, 23
]), gl.STATIC_DRAW)

let draw = function () {
  requestAnimationFrame(draw)

  let t = performance.now() / 10000
  let t2 = (t * 100) % 1
  let t3 = 1 / Math.cos(t * 0.3)

  glm.mat4.identity(mv)
  glm.mat4.translate(mv, mv, [0, 0, -8])
  glm.mat4.rotate(mv, mv, t * 10, [0.5,Math.tan(t) * 3,Math.sin(t)])
  glm.mat4.scale(mv, mv, [0.25, 3, 1.5])
  normal = glm.mat3.create()
  glm.mat3.normalFromMat4(normal, mv)

  dither.bind()
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(prog)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff)
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff)
  gl.vertexAttribPointer(vAttr, 3, gl.BYTE, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuff)
  gl.vertexAttribPointer(nAttr, 3, gl.BYTE, false, 0, 0)

  gl.uniformMatrix3fv(normalUni, false, normal)
  gl.uniformMatrix4fv(projUni, false, proj)
  gl.uniformMatrix4fv(mvUni, false, mv)

  gl.enableVertexAttribArray(vAttr)
  gl.enableVertexAttribArray(nAttr)
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
  gl.disableVertexAttribArray(vAttr)
  gl.disableVertexAttribArray(nAttr)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  dither.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))
}

draw()
