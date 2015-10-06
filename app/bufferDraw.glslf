#version 300 es
precision highp float;

layout(location = 0) out vec4 colorData0;
layout(location = 1) out vec4 colorData1;
layout(location = 2) out vec4 colorData2;

void main() {
  colorData0 = vec4(1, 0, 1, 1);
  colorData1 = vec4(1, 0, 1, 1);
  colorData2 = vec4(1, 0, 1, 1);
}
