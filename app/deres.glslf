precision mediump float;

#pragma glslify: deres = require(./deres.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

varying vec2 screenCoords;

uniform float t;

void main() {
  gl_FragColor = deres(texture2D(depth, screenCoords) * texture2D(frame, deres(screenCoords, t)), t * .5);
}
