import _ from 'lodash'

let Texture = class {
  constructor (gl, options = {}) {
    this.gl = gl

    _.defaults(this, options, {
      target: gl.TEXTURE_2D,
      type: gl.UNSIGNED_BYTE,
      format: gl.RGBA,
      mag: gl.NEAREST,
      min: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      width: 32,
      height: 32
    })

    this.texture = gl.createTexture()
    this.bind()

    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.mag)
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.min)
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS)
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT)

    this.resize(this.width, this.height)

    this.gl.bindTexture(this.target, null)
  }
  resize (width, height) {
    this.width = width
    this.height = height
    this.bind()
    this.gl.texImage2D(this.target, 0, this.format, this.width, this.height, 0, this.format, this.type, null)
    this.unbind()
  }
  bind () {
    this.gl.bindTexture(this.target, this.texture)
  }
  unbind () {
    this.gl.bindTexture(this.target, null)
  }
}
export default Texture
