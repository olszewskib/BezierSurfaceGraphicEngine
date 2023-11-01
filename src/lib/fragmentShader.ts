
export const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentColor;
in vec3 fragmentNormal;

uniform vec3 reverseLightDirection;

out vec4 outputColor;

void main() {

    vec3 normal = normalize(fragmentNormal);
    float light = dot(normal, reverseLightDirection);

    outputColor = vec4(fragmentColor, 1.0);
    outputColor.rgb *= light;
}`;