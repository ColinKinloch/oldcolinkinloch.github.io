let ShaderProgramCurry = (gl) => {
  let ShaderProgram = class {
    constructor (shaders) {
      this.program = gl.createProgram()
      for (let shader of shaders) {
        gl.attachShader(this.program, shader.shader)
      }
      gl.linkProgram(this.program)
    }
    getAttribLocation (name) {
      return gl.getAttribLocation(this.program, name)
    }
    getUniformLocation (name) {
      return gl.getUniformLocation(this.program, name)
    }
    getFragDataLocation (name) {
      gl.getFragDataLocation(this.program, name)
    }
    use () {
      gl.useProgram(this.program)
    }
  }
  return ShaderProgram
}

export default ShaderProgramCurry
