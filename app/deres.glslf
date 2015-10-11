#version 300 es
precision mediump float;

#pragma glslify: deres = require(./deres.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoord;

uniform float t;

out vec4 fragmentColour;

void main() {
  fragmentColour = deres(texture(depth, screenCoord) * texture(frame, deres(screenCoord, t)), t * .5);
}
