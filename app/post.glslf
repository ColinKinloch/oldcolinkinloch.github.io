precision mediump float;

uniform sampler2D frame;

varying vec2 screenCoords;

void main() {
  gl_FragColor = texture2D(frame, screenCoords);
}
