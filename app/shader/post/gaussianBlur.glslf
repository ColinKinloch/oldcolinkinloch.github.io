#version 100
precision mediump float;

const int v = 7;

uniform sampler2D frame;
uniform sampler2D depth;
uniform sampler2D gauss;
uniform float gaussMult;

varying vec2 screenCoord;

void main() {
  vec2 s = floor(gl_FragCoord.xy / screenCoord);
  float h = 1. / s.x;
  vec4 sum = vec4(0.);
  for(int x = -v; x < v; ++x) {
    for(int y = -v; y < v; ++y) {
      vec2 d = vec2(x, y);
      sum += texture2D(frame, vec2(screenCoord.x - d.x * h, screenCoord.y - d.y * h) ) * (texture2D(gauss, abs(d) / float(v + 1) ).a * gaussMult);
    }
  }
  gl_FragColor = sum;
}
