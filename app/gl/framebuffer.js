let Framebuffer = (gl) => {
  let FramebufferCurry = class {
    constructor () {
      this.framebuffer = gl.createFramebuffer()
    }
    check () {
      this.bind()
      switch (gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
        case gl.FRAMEBUFFER_COMPLETE: {
          return true
        }
        default: {
          console.error('Unknown framebuffer status')
          return false
        }
      }
    }
    bind () {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    }
    static unbind () {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
  }
  return FramebufferCurry
}

export default Framebuffer
