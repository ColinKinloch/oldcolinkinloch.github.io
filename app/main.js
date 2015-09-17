document.querySelector('#year').innerHTML = new Date().getYear()

let glm = require('gl-matrix')

let vert = require('./main.glslv')
let frag = require('./main.glslf')

let mv = glm.mat4.create()
let proj = glm.mat4.create()

let el = document.querySelector('#main')
let glopts = {
  antialias: false,
  alpha: true
}
let gl = el.getContext('webgl', glopts) || el.getContext('experimental-webgl', glopts)
window.gl = gl
let resize = function (w, h)
{
  el.width = w
  el.height = h
  gl.viewport(0, 0, w, h)
  glm.mat4.perspective(proj, 45, w / h, 0.1, 100.0)
  //glm.mat4.ortho(proj, w / -2, w / 2, h / -2, h / 2, -100, 100)
}
window.addEventListener('resize', function(e) {
  resize(e.target.innerWidth, e.target.innerHeight)
})
window.dispatchEvent(new Event('resize'))
gl.clearColor(0,0,0,0)
let shad = function(type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

let vertShad = shad(gl.VERTEX_SHADER, vert)
let fragShad = shad(gl.FRAGMENT_SHADER, frag)

let prog = gl.createProgram()
gl.attachShader(prog, vertShad)
gl.attachShader(prog, fragShad)
gl.linkProgram(prog)
gl.useProgram(prog)

let vAttr = gl.getAttribLocation(prog, 'pos')
gl.enableVertexAttribArray(vAttr)

let mvUni = gl.getUniformLocation(prog, 'mv')
let projUni = gl.getUniformLocation(prog, 'proj')

let vBuff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vBuff)
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
  -1, -1, -1,//0
  -1, -1,  1,//1
  -1,  1,  1,//2
  -1,  1, -1,//3
   1,  1, -1,//4
   1,  1,  1,//5
   1, -1,  1,//6
   1, -1, -1 //7
]), gl.STATIC_DRAW)
window.vBuff = vBuff

let iBuff = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
  //Left
  0, 1, 2,
  0, 2, 3,
  //Top
  3, 4, 5,
  3, 5, 2,
  //Front
  1, 2, 5,
  1, 5, 6,
  //Bottom
  0, 1, 6,
  0, 6, 7,
  //Right
  4, 5, 6,
  4, 6, 7,
  //Back
  0, 3, 4,
  0, 4, 7
]), gl.STATIC_DRAW)

let draw = function () {
  requestAnimationFrame(draw)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let r = performance.now() / 2000

  glm.mat4.identity(mv)
  glm.mat4.translate(mv, mv, [0, 0, -10])
  glm.mat4.rotate(mv, mv, r, [1,0,1])
  glm.mat4.scale(mv, mv, [0.75, 2.25, 1.5])

  gl.vertexAttribPointer(vAttr, 3, gl.BYTE, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff)

  gl.uniformMatrix4fv(projUni, false, proj)
  gl.uniformMatrix4fv(mvUni, false, mv)

  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}
draw()
