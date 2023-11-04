import { BezierSurface } from "./models/BezierSurface";
import { fragmentShaderSourceCode } from "./lib/fragmentShader";
import { vertexShaderSourceCode } from "./lib/vertexShader";
import { M4 } from "./models/m4";
import { deg2rad } from "./models/angles";
import { Vec3 } from "./models/vec3";
import { TriangleMesh, getColors, getNormals, getVertices } from "./models/triangleMesh";
import { createStaticVertexBuffer, getProgram } from "./webGL";


const precisionSlider = document.getElementById("precisionSlider") as HTMLInputElement;

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

if(precisionSlider == null || zSlider == null)
    throw new Error("slider not found");

precisionSlider.addEventListener("input", function() {
    precision = parseInt(precisionSlider.value,10);
    mesh.construct(precision);
    triangleVertices = getVertices(mesh);
    triangleNormals = getNormals(mesh);
    rgbTriangleColors = getColors(mesh);
    drawTriangles();
});

zSlider.addEventListener("input", function() {

    surface.setControlPointZValue(parseInt(xIndex.value,10),parseInt(yIndex.value,10),parseFloat(zSlider.value));

    var index = xIndex.value + yIndex.value;
    console.log(index);
    const cell = document.getElementById(index);
    if(cell) {
        cell.textContent = zSlider.value;
    }
    mesh.construct(precision);
    triangleVertices = getVertices(mesh);
    triangleNormals = getNormals(mesh);
    rgbTriangleColors = getColors(mesh);
    drawTriangles()
    
})

const xCameraSlider = document.getElementById("xCamera") as HTMLInputElement;
const yCameraSlider = document.getElementById("yCamera") as HTMLInputElement;
const zCameraSlider = document.getElementById("zCamera") as HTMLInputElement;
if(xCameraSlider == null || yCameraSlider == null || zCameraSlider == null) {
    throw new Error("CameraSlidersError");
}

var xCamera: number = 500;
var yCamera: number = 500;
var zCamera: number = 500;

xCameraSlider.addEventListener("input", function() {
    xCamera = parseInt(xCameraSlider.value,10);
    drawTriangles();
});
yCameraSlider.addEventListener("input", function() {
    yCamera = parseInt(yCameraSlider.value,10);
    drawTriangles();
});
zCameraSlider.addEventListener("input", function() {
    zCamera = parseInt(zCameraSlider.value,10);
    drawTriangles();
});

const xCameraDirectionSlider = document.getElementById("xCameraDirection") as HTMLInputElement;
const yCameraDirectionSlider = document.getElementById("yCameraDirection") as HTMLInputElement;
const zCameraDirectionSlider = document.getElementById("zCameraDirection") as HTMLInputElement;
if(xCameraDirectionSlider == null || yCameraDirectionSlider == null || zCameraDirectionSlider == null) {
    throw new Error("CameraSlidersError");
}

var xCameraDirection: number = 500;
var yCameraDirection: number = 500;
var zCameraDirection: number = 0;

xCameraDirectionSlider.addEventListener("input", function() {
    xCameraDirection = parseInt(xCameraDirectionSlider.value,10);
    drawTriangles();
});
yCameraDirectionSlider.addEventListener("input", function() {
    yCameraDirection = parseInt(yCameraDirectionSlider.value,10);
    drawTriangles();
});
zCameraDirectionSlider.addEventListener("input", function() {
    zCameraDirection = parseInt(zCameraDirectionSlider.value,10);
    drawTriangles();
});

const xLightLocationSlider = document.getElementById("xLightLocation") as HTMLInputElement;
const yLightLocationSlider = document.getElementById("yLightLocation") as HTMLInputElement;
const zLightLocationSlider = document.getElementById("zLightLocation") as HTMLInputElement;
if(xLightLocationSlider == null || yLightLocationSlider == null || zLightLocationSlider == null) {
    throw new Error("CameraSlidersError");
}

var xLightLocation: number = 500;
var yLightLocation: number = 800;
var zLightLocation: number = 100;

xLightLocationSlider.addEventListener("input", function() {
    lightLocation.v1 = parseInt(xLightLocationSlider.value,10);
    drawTriangles();
});
yLightLocationSlider.addEventListener("input", function() {
    lightLocation.v2 = parseInt(yLightLocationSlider.value,10);
    drawTriangles();
});
zLightLocationSlider.addEventListener("input", function() {
    lightLocation.v3 = parseInt(zLightLocationSlider.value,10);
    drawTriangles();
});

const mirrorSlider = document.getElementById("mirror") as HTMLInputElement;
if(mirrorSlider == null) {
    throw new Error("mirror error");
}

var mirror: number = 150;

mirrorSlider.addEventListener("input", function() {
    mirror = parseInt(mirrorSlider.value,10);
    drawTriangles();
})

const lightColorPicker = document.getElementById("lightColor") as HTMLInputElement;
if(lightColorPicker == null) {
    throw new Error("lightcolorpicker");
}

var lightColorVector: Vec3 = Vec3.convertFromHEX(lightColorPicker.value,true);

lightColorPicker.addEventListener("input", function() {
    lightColorVector = Vec3.convertFromHEX(lightColorPicker.value,true);
    drawTriangles();
})

var kdSlider = document.getElementById("Kd") as HTMLInputElement;
if(kdSlider == null) {
    throw new Error("kderror");   
}

var kd = parseFloat(kdSlider.value);

kdSlider.addEventListener("input", function() {
    kd = parseFloat(kdSlider.value);
    drawTriangles();
})


var ksSlider = document.getElementById("Ks") as HTMLInputElement;
if(ksSlider == null) {
    throw new Error("kderror");   
}

var ks = parseFloat(ksSlider.value);

ksSlider.addEventListener("input", function() {
    ks = parseFloat(ksSlider.value);
    drawTriangles();
})
// ------------------------------------------------------------------------- Code Below ------------------------------------------------------------------------

// Bezier Surface 
const surface = new BezierSurface();

// Triangle Mesh
var precision: number = 10;
const mesh = new TriangleMesh(precision,surface);

var triangleVertices = getVertices(mesh);
var triangleNormals = getNormals(mesh);
var rgbTriangleColors = getColors(mesh);

var lightLocation: Vec3 = new Vec3(xLightLocation,yLightLocation,zLightLocation);

// animation;
var animation: boolean = false;
var rotationSpeed = 20;
var then = 0;

// ------------------------------------------------------------------------ Main Program -------------------------------------------------------------------------

// getting Canvas
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if(!canvas) {
    throw new Error("Cant find canvas");
}

// getting gl context
const gl = canvas.getContext('webgl2');
if(!gl) {
    throw new Error("webGL not supported");
}

// creating a program
const drawTriangleProgram = getProgram(gl,vertexShaderSourceCode,fragmentShaderSourceCode);
    

function drawTriangles(now: number = 0) {

    if(animation) {
        now *= 0.001;
        var delta = now-then;
        then = now;
        lightLocation.rotate(deg2rad(rotationSpeed * delta),500,500);
    }

    if(!gl) {
        throw new Error("webGL not supported");
    }
    if(!drawTriangleProgram) {
        throw new Error("getProgramError");
    }
    
    // loading data to vertex buffers
    const triangleBuffer = createStaticVertexBuffer(gl, triangleVertices);
    const rgbTriabgleBuffer = createStaticVertexBuffer(gl, rgbTriangleColors);
    const normalsBuffer = createStaticVertexBuffer(gl, triangleNormals)

    // Attribute locations
    const vertexPositionAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexPosition');
    const vertexColorAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexColor');
    const vertexNormalAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexNormal');
    if (vertexPositionAttributeLocation < 0 || vertexColorAttributeLocation < 0 || vertexNormalAttributeLocation < 0) return;

    // Uniform locations
    const worldViewProjectionLocation = gl.getUniformLocation(drawTriangleProgram, 'worldViewProjection');
    const worldLocation = gl.getUniformLocation(drawTriangleProgram, 'world');
    const lightPositionLocation = gl.getUniformLocation(drawTriangleProgram, 'lightPosition');
    const eyePositionLocation = gl.getUniformLocation(drawTriangleProgram, 'eyePosition');
    const mirrorLocation = gl.getUniformLocation(drawTriangleProgram, 'mirror');
    const lightColorLocation = gl.getUniformLocation(drawTriangleProgram, 'lightColor');
    const kdLocation = gl.getUniformLocation(drawTriangleProgram, 'kd');
    const ksLocation = gl.getUniformLocation(drawTriangleProgram, 'ks');
    // need an error check

    // Output merger (how to apply an updated pixel to the output image)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Attatch all needed attributes
    gl.useProgram(drawTriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexColorAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);

    // How to read vertex information from buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(vertexPositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(vertexNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer)
    gl.vertexAttribPointer(vertexColorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);


    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(120),canvas.clientWidth/canvas.clientHeight,1,2000);

    // This matrix positions the camera in the world 
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera); // location of the camera in the space
    var targetPosition: Vec3 = new Vec3(xCameraDirection,yCameraDirection,zCameraDirection); // this dictates in which direction the camera is pointing
    var upVector: Vec3 = new Vec3(0,1,0); // this set the "up" direction of the world;
    var cameraMatrix = M4.pointAt(cameraPosition, targetPosition, upVector);
    
    // This matrix is responsible for moving object in the world in front of the camera, it is the inversion
    // of camera matrix this way we can obtain static camera effect
    var viewMatrix = cameraMatrix.inverse();
    
    // This matrix first moves the object in front of the camera <vievMatrix> and then clips it into space <projectionMatrix>
    var viewProjectionMatrix = M4.multiply(viewMatrix,projectionMatrix);

    // This matrix takes the vertices of the model and moved them to the world space, so basicly it determines where things are
    var worldMatrix = M4.scaling(1000,1000,1000);

    // This matix first moves our obj <worldMatrix> then when it is set it moves it in front of the camera <viewMatix> and lastly clips it into space <projectionMatrix>
    var worldViewProjectionMatrix = M4.multiply(worldMatrix,viewProjectionMatrix);

    gl.uniformMatrix4fv(worldLocation, false, worldMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    gl.uniform3fv(lightPositionLocation, lightLocation.getVec3ForBuffer());
    gl.uniform3fv(eyePositionLocation,cameraPosition.getVec3ForBuffer());
    gl.uniform1f(mirrorLocation,mirror)
    gl.uniform1f(ksLocation,ks);
    gl.uniform1f(kdLocation,kd);
    gl.uniform3fv(lightColorLocation,lightColorVector.getVec3ForBuffer());

    gl.drawArrays(gl.TRIANGLES, 0, mesh.triangles.length * 3);

    if(animation) {
        requestAnimationFrame(drawTriangles);
    }
}

drawTriangles();