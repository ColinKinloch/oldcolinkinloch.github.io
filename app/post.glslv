precision mediump float;

attribute vec2 position;
varying vec2 screenCoords;

void main() {
  screenCoords = position * 0.5;
  gl_Position = vec4(position - 1.0, 0, 1);
}
