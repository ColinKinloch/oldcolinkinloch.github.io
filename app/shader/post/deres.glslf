#version 100
precision mediump float;

#pragma glslify: deres = require(../lib/deres.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

varying vec2 screenCoord;

uniform float t;

void main() {
  gl_FragColor = deres(texture2D(depth, screenCoord) * texture2D(frame, deres(screenCoord, t)), t * .5);
}
