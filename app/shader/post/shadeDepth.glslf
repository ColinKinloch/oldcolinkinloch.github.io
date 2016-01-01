#version 100
precision mediump float;

uniform sampler2D frame;
uniform sampler2D depth;

uniform ivec2 destSize;

varying vec2 screenCoord;

void main() {
  float d = 1. - texture2D(depth, screenCoord).r;
  vec4 c = texture2D(frame, screenCoord);
  gl_FragColor = vec4(c.rgb * d, c.a);
}
