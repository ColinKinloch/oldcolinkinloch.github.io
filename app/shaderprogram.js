let ShaderProgram = class {
  constructor (gl, shaders) {
    this.gl = gl
    this.program = gl.createProgram()
    for (let shader of shaders) {
      gl.attachShader(this.program, shader.shader)
    }
    gl.linkProgram(this.program)
  }
  getAttribLocation (name) {
    return this.gl.getAttribLocation(this.program, name)
  }
  getUniformLocation (name) {
    return this.gl.getUniformLocation(this.program, name)
  }
  getFragDataLocation (name) {
    this.gl.getFragDataLocation(this.program, name)
  }
  use () {
    this.gl.useProgram(this.program)
  }
}
export default ShaderProgram
