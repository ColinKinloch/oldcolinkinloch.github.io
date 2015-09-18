attribute vec3 position;
attribute vec3 normal;

uniform mat4 mv;
uniform mat4 proj;

void main(void) {
  gl_Position = proj * mv * vec4(position, 1.0);
}
