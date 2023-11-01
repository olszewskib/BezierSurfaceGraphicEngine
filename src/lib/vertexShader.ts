
export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexColor;
in vec3 vertexNormal;


// ([x,y,z],w) -> w will be set up as defalut 1.0
in vec4 vertexPosition;

// matrix for transformations
uniform mat4 matrix;

out vec3 fragmentColor;
out vec3 fragmentNormal;

void main() {
    fragmentColor = vertexColor;

    gl_Position = matrix * vertexPosition;

    fragmentNormal = vertexNormal;
}`;