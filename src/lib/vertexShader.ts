
export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexColor;

in vec4 vertexPosition;
in vec3 vertexNormal;

// matrix for transformations
uniform mat4 world;
uniform mat4 worldViewProjection;

out vec3 fragmentColor;
out vec3 fragmentNormal;

void main() {

    gl_Position = worldViewProjection * vertexPosition;

    // normals are directions we dont need translation so only 3x3 part of the world matrix
    fragmentNormal = mat3(world) * vertexNormal;

    // color of the vertex
    fragmentColor = vertexColor;
}`;