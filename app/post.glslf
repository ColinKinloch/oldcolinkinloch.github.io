precision mediump float;

uniform sampler2D frame;

varying vec2 screenCoords;

uniform float t;

void main() {
  gl_FragColor = texture2D(frame, screenCoords);
}
