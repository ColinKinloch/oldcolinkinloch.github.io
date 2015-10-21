import glm from 'gl-matrix'
import _ from 'lodash'
import Vector2 from './vector2.js'

let Vector3 = class extends Vector2 {
  constructor (x, y, z) {
    super(x, y)
    if (_.isNumber(z)) this.z = z
  }
  reset () {
    this.vec = glm.vec3.create()
  }
  get z () {
    return this.vec[2]
  }
  set z (v) {
    this.vec[2] = v
  }
  get xyz () {
    return glm.vec3.clone(this.vec)
  }
  set xyz (v) {
    glm.vec3.copy(this.vec, v)
  }
}

export default Vector3
