#version 300 es
precision mediump float;

const int v = 3;
#pragma glslify: gaussian = require(./gaussian.glsl)

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;
out vec4 fragmentColour;

void main() {
  ivec2 s = ivec2(floor(gl_FragCoord.xy / screenCoords));
  float h = 1. / s.x;
  vec4 sum = vec4(0.);
  for(int x = -v; x < v; ++x)
    for(int y = -v; y < v; ++y)
	    sum += texture(frame, vec2(screenCoords.x - x*h, screenCoords.y - y*h) ) * gaussian(x,y);
  fragmentColour.rgba = sum.rgba;
}
