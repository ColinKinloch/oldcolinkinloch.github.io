import _ from 'lodash'
let AttributeCurry = (gl) => {
  let Attribute = class {
    constructor (name, opts = {}) {
      this.name = name
      _.defaults(this, opts, {
        size: 3,
        type: gl.FLOAT,
        normalized: false,
        stride: 0
      })
    }
    getLocation (program) {
      this.location = program.getAttribLocation(this.name)
    }
    pointer (pointer = 0) {
      gl.vertexAttribPointer(this.location, this.size, this.type, this.normalized, this.stride, pointer)
    }
    enable () {
      gl.enableVertexAttribArray(this.location)
    }
    disable () {
      gl.disableVertexAttribArray(this.location)
    }
  }
  return Attribute
}

export default AttributeCurry
