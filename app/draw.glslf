#version 300 es
precision mediump float;

uniform sampler2D frame;

in vec2 screenCoord;
out vec4 fragmentColour;

void main() {
  fragmentColour = texture(frame, screenCoord);
}
