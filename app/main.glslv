attribute vec3 pos;

uniform mat4 mv;
uniform mat4 proj;

void main(void) {
  gl_Position = proj * mv * vec4(pos, 1.0);
}
