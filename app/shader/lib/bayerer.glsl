const int b[64] = int[](
   1,49,13,61, 4,52,16,64,
  33,17,45,29,36,20,48,32,
   9,57, 5,53,12,60, 8,56,
  41,25,37,21,44,28,40,24,
   3,51,15,63, 2,50,14,62,
  35,19,47,31,34,18,46,30,
  11,59, 7,55,10,58, 6,54,
  43,27,39,23,42,26,38,22
);
const float m = 1. / 65.;

float bayerer(in int order, in vec2 coord) {
  ivec2 c = ivec2(mod(gl_FragCoord.xy, order));
  return b[8 * c.y + c.x] * m;
}

#pragma glslify: export(bayerer)
