import Node3DCurry from './gl/node3d.js'

let MeshCurry = (gl) => {
  let Node3D = Node3DCurry(gl)
  let Mesh = class extends Node3D {
    constructor (geometry, material) {
      super()
      this.geometry = geometry
      this.material = material
    }
  }
  return Mesh
}

export default MeshCurry
