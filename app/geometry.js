let GeometryCurry = (gl) => {
  let Geometry = class {
    constructor () {
      this.attributes = {}
    }
    addAttribute (name, attribute) {
      this.attrubets[name] = attribute
    }
  }
  return Geometry
}

export default GeometryCurry
