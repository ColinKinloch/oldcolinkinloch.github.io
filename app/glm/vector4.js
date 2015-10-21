import glm from 'gl-matrix'
import _ from 'lodash'
import Vector3 from './vector3.js'

let Vector4 = class extends Vector3 {
  constructor (x, y, z, w) {
    super(x, y, z)
    if (_.isNumber(w)) this.w = w
  }
  reset () {
    this.vec = glm.vec4.create()
  }
  get w () {
    return this.vec[3]
  }
  set w (v) {
    this.vec[3] = v
  }
  get xyzw () {
    return glm.vec4.clone(this.vec)
  }
  set xyzw (v) {
    glm.vec4.copy(this.vec, v)
  }
}

export default Vector4
