#version 300 es
precision mediump float;

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;
out vec4 fragmentColour;

void main() {
  ivec2 s = ivec2(floor(gl_FragCoord.xy / screenCoords));
  float h = 1. / s.x;
  vec4 sum = vec4(0.);
  float b = 3.;
  for(float i = -b; i < b; ++i)
	  sum += texture(frame, vec2(screenCoords.x - i*h, screenCoords.y) ) * abs(i/(b*2.));
  fragmentColour.rgba = sum.rgba;
}
