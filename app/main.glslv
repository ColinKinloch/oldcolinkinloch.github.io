#version 300 es

#pragma glslify: deres = require(./deres.glsl)

in vec3 position;
in vec3 normal;

out vec3 vNormal;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * deres(modelViewMatrix * vec4(position, 1.0), 18.0);
}
