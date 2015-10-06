let Shader = class {
  constructor (gl, type, source) {
    this.shader = gl.createShader(type)
    gl.shaderSource(this.shader, source)
    gl.compileShader(this.shader)
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(this.shader))
      let s = source.split('\n')
      source = ''
      let i = 0
      for (let l of s) {
        i++
        source += `${i}:${l}\n`
      }
      console.error(source)
      return null
    }
  }
}

export default Shader
