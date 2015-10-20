import Node3DCurry from './gl/node3d.js'

let MeshCurry = (gl) => {
  let Node3D = Node3DCurry(gl)
  class Mesh extends Node3D {
    constructor () {
      super()
    }
  }
  return Mesh
}

export default MeshCurry
