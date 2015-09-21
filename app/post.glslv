#version 300 es

precision mediump float;

in vec2 position;
out vec2 screenCoords;

void main() {
  screenCoords = position * 0.5;
  gl_Position = vec4(position - 1.0, 0.0, 1.0);
}
