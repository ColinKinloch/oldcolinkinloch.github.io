const float pi = 3.14159265359;
const float e = 2.71828182845;

float G(in int x, in int y, in float sigma) {
  float s = 2.* pow(sigma, 2.);
  return 1. / (pi * s) * pow(e, -(x * x + y * y) / s);
}
const float s = 0.85;

const int v = 3;
const int u = int(v + 1);

float[u*u] g = float[](
  G(0,0,s), G(1,0,s), G(2,0,s), G(3,0,s),
  G(0,1,s), G(1,1,s), G(2,1,s), G(3,1,s),
  G(0,2,s), G(1,2,s), G(2,2,s), G(3,2,s),
  G(0,3,s), G(1,3,s), G(2,3,s), G(3,3,s)
);


float gaussian(in int x, in int y) {
  return g[abs(y)+(v*abs(x))];
}

#pragma glslify: export(gaussian)
