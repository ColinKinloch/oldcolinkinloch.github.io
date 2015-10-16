#version 300 es

#pragma glslify: deres = require(./deres.glsl)

in vec3 position;
in vec3 normal;

out vec3 vNormal;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  vec4 pos = modelViewMatrix * vec4(position, 1.);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * pos;//deres(pos, 60.0);
}
