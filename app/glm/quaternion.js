import glm from 'gl-matrix'
import Vector4 from './vector4.js'

let Quaternion = class extends Vector4 {
  constructor (x, y, z, w) {
    super(x, y, z, w)
  }
  reset () {
    this.vec = glm.quat.create()
  }
  rotateX (rad) {
    glm.quat.rotateX(this.vec, this.vec, rad)
  }
  rotateY (rad) {
    glm.quat.rotateY(this.vec, this.vec, rad)
  }
  rotateZ (rad) {
    glm.quat.rotateZ(this.vec, this.vec, rad)
  }
  calculateW () {
    glm.quat.calculateW(this.vec, this.vec)
  }
  normalize () {
    glm.quat.normalize(this.vec, this.vec)
  }
}

export default Quaternion
