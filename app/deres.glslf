#version 300 es
precision mediump float;

#pragma glslify: deres = require(./deres.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;

uniform float t;

out vec4 fragmentColour;

void main() {
  fragmentColour = deres(texture(depth, screenCoords) * texture(frame, deres(screenCoords, t)), t * .5);
}
