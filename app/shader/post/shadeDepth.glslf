#version 300 es
precision mediump float;

uniform sampler2D frame;
uniform sampler2D depth;

uniform ivec2 destSize;

in vec2 screenCoord;
out vec4 fragmentColour;

void main() {
  float d = 1 - texture(depth, screenCoord).r;
  vec4 c = texture(frame, screenCoord);
  fragmentColour = vec4(c.rgb * d, c.a);
}
