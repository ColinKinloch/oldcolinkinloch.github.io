#version 300 es
precision mediump float;

uniform sampler2D frame;
uniform sampler2D depth;

in vec2 screenCoords;
out vec4 fragmentColour;

void main() {
  float d = texture(depth, screenCoords).r;
  vec4 c = texture(frame, screenCoords);
  fragmentColour = vec4(c.rgb * d, c.a);
}
