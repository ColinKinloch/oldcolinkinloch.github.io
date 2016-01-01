import _ from 'lodash'

let Texture2DCurry = (gl) => {
  let Texture2D = class {
    constructor (options = {}) {
      _.defaults(this, options, {
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

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.mag)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.min)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT)

      this.resize(this.width, this.height)

      gl.bindTexture(gl.TEXTURE_2D, null)
    }
    resize (width, height) {
      this.width = width
      this.height = height
      this.bind()
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, null)
      this.unbind()
    }
    bind () {
      gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }
    unbind () {
      gl.bindTexture(gl.TEXTURE_2D, null)
    }
  }
  return Texture2D
}

export default Texture2DCurry
