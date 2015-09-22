#version 300 es
precision mediump float;

#pragma glslify: deres = require(./deres.glsl)
#pragma glslify: bayerer = require(./bayerer.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;
out vec4 fragmentColour;

void main() {
  ivec2 c = ivec2(mod(gl_FragCoord.xy, 4.));
  vec4 p = texture(frame, screenCoords);
  float d = texture(depth, screenCoords).r;
  vec4 pixel = vec4(p.rgb * d, p.a);
  vec4 dithered = pixel + pixel * bayerer(8., gl_FragCoord.xy);
  fragmentColour = deres(dithered, 2.);
}
