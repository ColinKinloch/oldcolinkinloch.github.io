import glm from 'gl-matrix'
import _ from 'lodash'

class Vector2 {
  constructor (x, y) {
    this.reset()
    if (_.isNumber(x)) this.x = x
    if (_.isNumber(y)) this.y = y
  }
  reset () {
    this.vec = glm.vec2.create()
  }
  get x () {
    return this.vec[0]
  }
  set x (v) {
    this.vec[0] = v
  }
  get y () {
    return this.vec[1]
  }
  set y (v) {
    this.vec[1] = v
  }
  get xy () {
    return glm.vec2.clone(this.vec)
  }
  set xy (v) {
    glm.vec2.copy(this.vec, v)
  }
}

export default Vector2
