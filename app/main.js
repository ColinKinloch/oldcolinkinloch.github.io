document.querySelector('#year').innerHTML = new Date().getYear()

let glm = require('gl-matrix')

let vert = require('./main.glslv')
let frag = require('./main.glslf')

let vertPost = require('./post.glslv')
let fragPost = require('./post.glslf')

let mv = glm.mat4.create()
let proj = glm.mat4.create()

let el = document.querySelector('#main')
let glopts = {
  antialias: false,
  alpha: true
}
let gl = el.getContext('webgl', glopts) || el.getContext('experimental-webgl', glopts)
gl.enable(gl.DEPTH_TEST)
gl.clearColor(0,0,0,0)
gl.clearDepth(1)
window.gl = gl

let fb = gl.createFramebuffer()
let db = gl.createRenderbuffer()
let frame = gl.createTexture()

gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
gl.bindRenderbuffer(gl.RENDERBUFFER, db)
gl.bindTexture(gl.TEXTURE_2D, frame)

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

let s = 124
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, s, s, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, s, s)

gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frame, 0)
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, db)

gl.bindFramebuffer(gl.FRAMEBUFFER, null)
gl.bindRenderbuffer(gl.RENDERBUFFER, null)
gl.bindTexture(gl.TEXTURE_2D, null)
window.fb = fb

if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.log('framebuffer incomplete')
}

let resize = function (w, h)
{
  el.width = w
  el.height = h
  gl.viewport(0, 0, w, h)
  glm.mat4.perspective(proj, 45, w / h, 0.1, 100.0)
  //glm.mat4.ortho(proj, w / -2, w / 2, h / -2, h / 2, -100, 100)

  gl.bindRenderbuffer(gl.RENDERBUFFER, db)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h)
  gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, frame)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.bindTexture(gl.TEXTURE_2D, null)
}

window.addEventListener('resize', function(e) {
  resize(e.target.innerWidth, e.target.innerHeight)
})
window.dispatchEvent(new Event('resize'))

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
let vAttr = gl.getAttribLocation(prog, 'position')
let nAttr = gl.getAttribLocation(prog, 'normal')

let mvUni = gl.getUniformLocation(prog, 'mv')
let projUni = gl.getUniformLocation(prog, 'proj')

let vertPostShad = shad(gl.VERTEX_SHADER, vertPost)
let fragPostShad = shad(gl.FRAGMENT_SHADER, fragPost)

let postProg = gl.createProgram()
gl.attachShader(postProg, vertPostShad)
gl.attachShader(postProg, fragPostShad)
gl.linkProgram(postProg)

gl.useProgram(postProg)
let pvAttr = gl.getAttribLocation(postProg, 'position')

let fUni = gl.getUniformLocation(postProg, 'frame')
let tUni = gl.getUniformLocation(postProg, 't')

let sBuff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, sBuff)
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
  0, 0,
  0, 5,
  5, 0
]), gl.STATIC_DRAW)

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

  let t = performance.now() / 10000

  glm.mat4.identity(mv)
  glm.mat4.translate(mv, mv, [0, 0, -12])
  glm.mat4.rotate(mv, mv, t * 10, [1,0,1])
  glm.mat4.scale(mv, mv, [0.15, 2.25, 1.5])

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.useProgram(prog)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff)
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff)

  gl.enableVertexAttribArray(vAttr)
  gl.vertexAttribPointer(vAttr, 3, gl.BYTE, false, 0, 0)

  gl.uniformMatrix4fv(projUni, false, proj)
  gl.uniformMatrix4fv(mvUni, false, mv)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, frame)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)

  gl.disableVertexAttribArray(vAttr)

  gl.useProgram(postProg)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindBuffer(gl.ARRAY_BUFFER, sBuff)
  gl.vertexAttribPointer(pvAttr, 2, gl.UNSIGNED_BYTE, false, 0, 0)
  gl.uniform1f(tUni, t * 10)
  gl.enableVertexAttribArray(pvAttr)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  gl.disableVertexAttribArray(pvAttr)
}

draw()
