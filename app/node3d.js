import {Vector3, Quaternion, Matrix4} from './glm'

let Node3D = class {
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

export default Node3D
