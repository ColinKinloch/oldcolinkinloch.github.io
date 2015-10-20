import {Vector3, Quaternion, Matrix4} from './vector.js'

let Node3DCurry = (gl) => {
  class Node3D {
    constructor () {
      this.position = new Vector3()
      this.rotation = new Quaternion()
      this.matrix = new Matrix4()
      this.children = []
    }
    traverse (func) {
      func(this)
      for (let node in this.children) {
        node.traverse(func)
      }
    }
    updateMatrix () {
      this.matrix.fromRotationTranslation(this.rotation, this.position)
    }
  }
  return Node3D
}

export default Node3DCurry
