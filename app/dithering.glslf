#version 300 es
precision mediump float;

#pragma glslify: deres = require(./deres.glsl)
#pragma glslify: bayerer = require(./bayerer.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoord;
out vec4 fragmentColour;

void main() {
  ivec2 sourceSize = textureSize(frame, 0);
  ivec2 destSize = ivec2(floor(gl_FragCoord.xy / screenCoord));
  vec2 destCoord = screenCoord * vec2(sourceSize) / vec2(destSize);
  float h = 1. / destSize.x;
  ivec2 c = ivec2(mod(destCoord, 4.));
  vec4 p = texture(frame, destCoord);
  vec4 pixel = vec4(p.rgb + .7, p.a);
  vec4 dithered = pixel + pixel * bayerer(8, gl_FragCoord.xy);
  fragmentColour = vec4(deres(dithered.rgb, .7), p.a);
}
