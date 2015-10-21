import glm from 'gl-matrix'

class Matrix4 {
  constructor () {
    this.reset()
  }
  reset () {
    this.mat = glm.mat4.create()
  }
  multiply (b) {
    glm.mat4.multiply(this.mat, this.mat, b.mat)
  }
  fromRotationTranslation (rot, pos) {
    glm.mat4.fromRotationTranslation(this.mat, rot.vec, pos.vec)
  }
  static multiplyMatrices (a, b) {
    this.out = new Matrix4()
    glm.mat4.muliply(this.out.mat, a.mat, b.mat)
    return this.out
  }
}

export default Matrix4
