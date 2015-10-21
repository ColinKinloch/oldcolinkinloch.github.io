import Node3DCurry from './node3d.js'
import {Matrix4} from './vector.js'

let CameraCurry = (gl) => {
  let Node3D = Node3DCurry(gl)

  let Camera = class extends Node3D {
    constructor () {
      super()
      this.projection = new Matrix4()
    }
  }
  return Camera
}

export default CameraCurry
