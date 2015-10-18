import glm from 'gl-matrix'
import _ from 'lodash'

class Vector2 {
  constructor (x, y) {
    this.reset()
    this.x = x
    this.y = y
  }
  reset () {
    this.vec = glm.vec2.create()
  }
  get x () {
    return this.vec[0]
  }
  set x (val) {
    if (!_.isUndefined(val)) this.vec[0] = val
  }
  get y () {
    return this.vec[1]
  }
  set y (val) {
    if (!_.isUndefined(val)) this.vec[1] = val
  }
}
class Vector3 extends Vector2 {
  constructor (x, y, z) {
    super(x, y)
    this.z = z
  }
  reset () {
    this.vec = glm.vec3.create()
  }
  get z () {
    return this.vec[2]
  }
  set z (val) {
    if (!_.isUndefined(val)) this.vec[2] = val
  }
}
class Vector4 extends Vector3 {
  constructor (x, y, z, w) {
    super(x, y, z)
    this.w = w
  }
  reset () {
    this.vec = glm.vec4.create()
  }
  get w () {
    return this.vec[3]
  }
  set w (val) {
    if (!_.isUndefined(val)) this.vec[3] = val
  }
}
class Quaternion extends Vector4 {
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
  normalize () {
    glm.quat.normalize(this.vec, this.vec)
  }
}
export {Vector2, Vector3, Vector4, Quaternion}
