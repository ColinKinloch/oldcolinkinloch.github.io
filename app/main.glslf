precision mediump float;

varying vec3 vNormal;

void main(void) {
  gl_FragColor = vec4(vNormal, 1) * 0.5 + 0.6; //vec4(0.6, 1, vNormal.x * 0.5, 1);
}
