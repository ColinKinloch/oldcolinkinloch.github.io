precision mediump float;

#pragma glslify: deres = require(./deres.glsl)

uniform sampler2D frame;

varying vec2 screenCoords;

uniform float t;

void main() {
  gl_FragColor = texture2D(frame, deres(screenCoords, 250.0 * (0.8 + 0.7 * sin(t))));
}
