#version 300 es
precision mediump float;

const float pi = 3.14159265359;
const float e = 2.71828182845;

#define S(sigma) (2. * pow(sigma, 2.))
//#define G(x,y,s) (1. / (pi * s) * pow(e, -((pow(x, 2.) + pow(y, 2.)) / s)))
#define G(x,y,s) 1. / (pi * s) * pow(e, -((x*x + y*y) / s))
const float s = S(1.);
const int v = 3;
const int u = int(v + 1);

const float[u*u] g = float[](
  G(0,0,s), G(0,1,s), G(0,2,s), G(0,3,s),
  G(1,0,s), G(1,1,s), G(1,2,s), G(1,3,s),
  G(2,0,s), G(2,1,s), G(2,2,s), G(2,3,s),
  G(3,0,s), G(3,1,s), G(3,2,s), G(3,3,s)
);


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
	    sum += texture(frame, vec2(screenCoords.x - x*h, screenCoords.y - y*h) ) * g[int(abs(x)+(v*abs(y)))];
  fragmentColour.rgba = sum.rgba;
}
