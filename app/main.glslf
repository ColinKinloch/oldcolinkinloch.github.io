#version 300 es
precision mediump float;

in vec3 vNormal;
out vec4 fragmentColour;

void main(void) {
  fragmentColour = vec4(vNormal, 1);// vec4(vec3((vNormal.x + vNormal.y + vNormal.z / 3.)), 1.);// vec4(vNormal, 1) * 0.5 + 0.6; //vec4(0.6, 1, vNormal.x * 0.5, 1);
}
