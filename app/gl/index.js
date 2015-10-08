import Texture2D from './texture2d.js'
import Shader from './shader.js'
import ShaderProgram from './shaderprogram.js'
import Framebuffer from './framebuffer.js'
import Post from './post.js'

let GL = (gl) => {
  let GLCurry = {
    gl: gl,
    Texture2D: Texture2D(gl),
    Shader: Shader(gl),
    ShaderProgram: ShaderProgram(gl),
    Framebuffer: Framebuffer(gl),
    Post: Post(gl)
  }
  return GLCurry
}

export default GL
