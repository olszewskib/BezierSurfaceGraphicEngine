
export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

// ([x,y,z],w) -> w will be set up as defalut 1.0
in vec4 vertexPosition;

// matrix for transformations
uniform mat4 matrix;

in vec3 vertexColor;
in vec3 vertexNormal;

uniform vec2 canvasSize;
uniform vec2 shapeLocation;
uniform float shapeSize;

out vec3 fragmentColor;
out vec3 fragmentNormal;

void main() {
    fragmentColor = vertexColor;

    gl_Position = matrix * vertexPosition;

    fragmentNormal = vertexNormal;
}`;