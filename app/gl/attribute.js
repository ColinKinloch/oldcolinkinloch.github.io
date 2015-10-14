import _ from 'lodash'
let AttributeCurry = (gl) => {
  let Attribute = class {
    constructor (name, opts = {}) {
      this.name = name
      _.defaults(this, opts, {
        size: 3,
        type: gl.FLOAT,
        normalized: false,
        stride: 0,
        offset: 0
      })
    }
    getLocation (program) {
      this.location = program.getAttribLocation(this.name)
    }
    pointer () {
      gl.vertexAttribPointer(this.location, this.size, this.type, this.normalized, this.stride, this.offset)
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
