#version 300 es
precision mediump float;

#pragma glslify: deres = require(./deres.glsl)
#pragma glslify: bayerer = require(./bayerer.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;
out vec4 fragmentColour;

void main() {
  ivec2 c = ivec2(mod(gl_FragCoord.xy, 4.0));
  float threshold = 1.0;
  vec4 pixel = texture(depth, screenCoords).r * texture(frame, screenCoords);
  vec4 dithered = pixel + pixel * bayerer(8.0, gl_FragCoord.xy);
  fragmentColour = deres(dithered, 3.0);
}
