import glm from 'gl-matrix'
import {Vector3} from './glm'

import GLCurry from './gl'
import EntityCurry from './entity.js'
import vert from './shader/main.glslv'
import frag from './shader/main.glslf'

let rotyduck = function () {
  let pos = []
  let m = new Vector3(5, 10, 8)
  let c = new Vector3(0, -8, -8)
  for (let i = 0; i < 30; ++i) {
    let r = () => { return 2 * Math.random() - 1 }
    let v = new Vector3(r(), r(), r())
    v.multiply(m)
    v.add(c)
    pos[i] = v
  }
  let projection = glm.mat4.create()

  let el = document.querySelector('#main')
  /*
  let ctx = new Context(el, {
    options: {
      antialias: false,
      alpha: true
    }
  })
  let gl = ctx.gl
  */
  let GL = GLCurry(el, {
    version: 1,
    options: {
      antialias: false,
      alpha: true
    },
    extensions: []
  })
  let gl = GL.gl
  let Entity = EntityCurry(gl)
  window.GL = GL

  /*
  let buffFragSrc = require('./bufferDraw.glslf')
  let buffFrag = new GL.Shader(gl.FRAGMENT_SHADER, buffFragSrc)
  */

  /*
  let buff = new ShaderProgram(gl, [buffFrag])
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
  ]

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
  */

  /*
  let blurFragSrc = require('./shader/post/gaussianBlur.glslf')
  let blurFrag = new GL.Shader(gl.FRAGMENT_SHADER, blurFragSrc)
  let blur = new GL.Post(blurFrag)
  */

  let ditherFragSrc = require('./shader/post/dithering.glslf')
  let ditherFrag = new GL.Shader(gl.FRAGMENT_SHADER, ditherFragSrc)
  let dither = new GL.Post(ditherFrag)

  let bayer = [
     1, 49, 13, 61,  4, 52, 16, 64,
    33, 17, 45, 29, 36, 20, 48, 32,
     9, 57,  5, 53, 12, 60,  8, 56,
    41, 25, 37, 21, 44, 28, 40, 24,
     3, 51, 15, 63,  2, 50, 14, 62,
    35, 19, 47, 31, 34, 18, 46, 30,
    11, 59,  7, 55, 10, 58,  6, 54,
    43, 27, 39, 23, 42, 26, 38, 22
  ]
  let bm = 255 / 65
  let width, height
  width = height = 8
  let channels = 1
  let pixels = new Uint8Array(width * height * channels)

  for (let i in bayer) {
    let p = i * channels
    let v = bayer[i] * bm
    pixels[p] = v
  }

  let format
  switch (channels) {
    case 1:
      format = gl.ALPHA
      break
    case 3:
      format = gl.RGB
      break
    case 4:
      format = gl.RGBA
  }

  dither.bayer = new GL.Texture2D({
    format: format
  })
  dither.bayer.bind()
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, pixels)

  dither.bayerUniform = dither.program.getUniformLocation('bayer')
  dither.bayer.unbind()

  let deresFragSrc = require('./shader/post/deres.glslf')
  let deresFrag = new GL.Shader(gl.FRAGMENT_SHADER, deresFragSrc)
  let deres = new GL.Post(deresFrag)

  /*
  let depthFragSrc = require('./shader/post/shadeDepth.glslf')
  let depthFrag = new GL.Shader(gl.FRAGMENT_SHADER, depthFragSrc)
  let depth = new GL.Post(depthFrag)
  */

  let drawFragSrc = require('./shader/post/draw.glslf')
  let drawFrag = new GL.Shader(gl.FRAGMENT_SHADER, drawFragSrc)
  let draw = new GL.Post(drawFrag)

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.log('framebuffer incomplete')
  }

  let resize = function (w, h) {
    let pr = devicePixelRatio
    el.width = w * pr
    el.height = h * pr
    gl.viewport(0, 0, w * pr, h * pr)
    let r = w / h
    glm.mat4.perspective(projection, 45, r, 3, 100)

    let s = 2
    let hw = (s * w) / 2
    let hh = (s * h) / 2

    // r = Math.min(h) / Math.max(h)
    if (w < h) {
      hh = s * r
      hw = s
    } else {
      hh = s
      hw = s / r
    }

    // glm.mat4.ortho(projection, -hw, hw, -hh, hh, -100, 100)
    let sM = 0.01
    glm.mat4.translate(projection, projection, [sM * -window.scrollX, sM * window.scrollY, 0])

    // glm.mat4.translate(projection, projection, [0, 0, -5])
    let scale = 1 // 0.125
    // depth.resize(w * scale, h * scale)
    deres.resize(w, h)
    dither.resize(w * scale, h * scale)
    // blur.resize(w, h)
    draw.resize(w * scale, h * scale)
    // buffResize(w, h)
  }

  window.addEventListener('resize', function (e) {
    resize(e.target.innerWidth, e.target.innerHeight)
  })
  window.addEventListener('scroll', function (e) {
    resize(window.innerWidth, window.innerHeight)
  })
  window.dispatchEvent(new Event('resize'))

  let vertShad = new GL.Shader(gl.VERTEX_SHADER, vert)
  let fragShad = new GL.Shader(gl.FRAGMENT_SHADER, frag)

  let prog = new GL.ShaderProgram([vertShad, fragShad])

  let entity = Entity.fromGLTFPath('./duck.gltf', {
    material: prog
  })

  let rafId = 0
  let render = function () {
    rafId = requestAnimationFrame(render)
    // gl.clearColor((t, 0, 0, 0)

    // depth.bind()
    dither.bind()

    let t = (performance.timing.navigationStart + performance.now()) / 10000

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    entity.rotation.x = Math.sin(5 * t)
    entity.rotation.y = Math.tan(t * 7)
    entity.rotation.z = Math.sin(t)
    entity.rotation.normalize()
    entity.rotation.calculateW()

    for (let d = 0; d < pos.length; ++d) {
      entity.position = pos[d]
      entity.draw(projection)
    }

    // depth.draw([dither.width, dither.height])

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
    // buff.use()
    // gl.drawBuffers(colorAttachment.slice(0, color.length))
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // let temp = _.pick(depth, ['frame', 'texture', 'depth'])
    // depth.frame = frame
    // depth.texture = color[0]
    // depth.depth = color[1]
    // _.extend(depth, temp)
    // dither.draw(250 * (0.5 + 0.3 * t3 * Math.tan(t2) * Math.sin(t * 10)))

    draw.bind()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    dither.program.use()
    gl.uniform1i(dither.bayerUniform, 2)
    gl.activeTexture(gl.TEXTURE0 + 2)
    dither.bayer.bind()
    dither.draw([draw.width, draw.height])

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    draw.draw([el.width, el.height])

    /*
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
      render()
    }
  })

  render()
}
export default rotyduck
