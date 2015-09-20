precision mediump float;

#pragma glslify: deres = require(./deres.glsl)
#pragma glslify: bayerer = require(./bayerer.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

varying vec2 screenCoords;

void main() {
  ivec2 c = ivec2(mod(gl_FragCoord.xy, 4.0));
  float threshold = 1.0;
  vec4 pixel = texture2D(depth, screenCoords) * texture2D(frame, screenCoords);
  vec4 dithered = pixel + pixel * bayerer(8, gl_FragCoord.xy);
  gl_FragColor = deres(dithered, 3.0);
}
