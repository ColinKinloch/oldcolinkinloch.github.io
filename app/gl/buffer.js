import _ from 'lodash'

let BufferCurry = (gl) => {
  let Buffer = class {
    constructor (options = {}) {
      _.defaults(this, options, {
        type: gl.FLOAT,
        binding: gl.ARRAY_BUFFER
      })
      this.buffer = gl.createBuffer()
    }
    bufferData (array) {
      this.bind()
      this.array = array
      gl.bufferData(this.binding, array, gl.STATIC_DRAW)
    }
    bind () {
      gl.bindBuffer(this.binding, this.buffer)
    }
    unbind () {
      gl.bindBuffer(this.binding, null)
    }
  }
  return Buffer
}

export default BufferCurry
