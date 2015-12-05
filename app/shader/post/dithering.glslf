#version 300 es
precision mediump float;

#pragma glslify: deres = require(../lib/deres.glsl)
#pragma glslify: bayerer = require(../lib/bayerer.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

uniform ivec2 destSize;

in vec2 screenCoord;
out vec4 fragmentColour;

void main() {
  ivec2 sourceSize = textureSize(frame, 0);
  float h = 1. / sourceSize.x;
  ivec2 c = ivec2(mod(screenCoord, 4.));
  vec4 p = texture(frame, screenCoord);
  vec4 pixel = vec4(p.rgb + .7, p.a);
  vec4 dithered = pixel + pixel * bayerer(8, gl_FragCoord.xy);
  pixel = vec4(deres(dithered.rgb, .7), dithered.a);
  if(pixel.r < 0.5) discard;
  fragmentColour = pixel;
}
