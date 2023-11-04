
export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

// vectors with input information
in vec4 vertexPosition;
in vec3 vertexNormal;
in vec3 vertexColor;

// matrix for transformations
uniform mat4 world;
uniform mat4 worldViewProjection;

// directional lighting
uniform vec3 lightPosition;
uniform vec3 eyePosition;

out vec3 fragmentColor;
out vec3 fragmentNormal;

out vec3 surfaceToLight;
out vec3 surfaceToEye;

void main() {

    gl_Position = worldViewProjection * vertexPosition;

    // normals are directions we dont need translation so only 3x3 part of the world matrix
    fragmentNormal = mat3(world) * vertexNormal;

    // we need to find surface postion
    vec3 surfacePosition = (world * vertexPosition).xyz;

    // now we can pass a direction to the fragment shader
    surfaceToLight = lightPosition - surfacePosition;

    // we need to compute surface to eye direction
    surfaceToEye = eyePosition - surfacePosition;

    // color of the vertex
    fragmentColor = vertexColor;
}`;