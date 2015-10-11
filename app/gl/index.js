import Context from './context.js'

let GLCurry = (el, opts) => {
  let GL = new Context(el, opts)
  return GL
}

export default GLCurry
