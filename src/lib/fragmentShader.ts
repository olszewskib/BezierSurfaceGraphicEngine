
export const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentColor;
in vec3 fragmentNormal;
in vec3 surfaceToLight;
in vec3 surfaceToEye;

// texture
in vec2 texCoord;
uniform sampler2D tex;

uniform float mirror;
uniform vec3 lightColor;

uniform float kd;
uniform float ks;

out vec4 outputColor;

void main() {

    vec3 normal = normalize(fragmentNormal);

    // calculating the half vector in order to set the direction of light reflection
    vec3 s2l = normalize(surfaceToLight);
    vec3 s2e = normalize(surfaceToEye);
    vec3 halfVector = normalize(s2l + s2e);

    float light = dot(normal, s2l);
    float reflect = 0.0;
    if(light > 0.0) {
        reflect = pow(dot(normal, halfVector), mirror);
    }

    outputColor = texture(tex,texCoord);
    //outputColor = vec4(fragmentColor, 1.0);
    outputColor.rgb *= (light * lightColor * kd);
    outputColor.rgb += (reflect * lightColor * ks);
}`;