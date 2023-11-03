import { BezierSurface } from "./BezierSurface";
import { fragmentShaderSourceCode } from "./lib/fragmentShader";
import { vertexShaderSourceCode } from "./lib/vertexShader";
import { M4 } from "./m4";
import { deg2rad } from "./models/angles";
import { Triangle } from "./models/triangle";
import { Vec3 } from "./models/vec3";
import { TriangleMesh, getNormals, getVertices } from "./triangleMesh";
import { createStaticVertexBuffer, getProgram } from "./webGL";


const slider = document.getElementById("precisionSlider") as HTMLInputElement;
const sliderValue = document.getElementById("sliderValue");

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

if(slider == null)
    throw new Error("slider not found");
if(sliderValue == null)
    throw new Error("slider not found");
if(zSlider == null)
    throw new Error("slider not found");

slider.addEventListener("input", function() {
    sliderValue.textContent = "Precision: " + slider.value;
    let precision = parseInt(slider.value,10);
    drawTriangles();
});

// Bezier Surface 
const surface = new BezierSurface();

zSlider.addEventListener("input", function() {

    surface.setControlPointZValue(parseInt(xIndex.value,10),parseInt(yIndex.value,10),parseFloat(zSlider.value));

    var index = xIndex.value + yIndex.value;
    const cell = document.getElementById(index);
    if(cell) {
        cell.textContent = zSlider.value;
    }
    
})



const canvasSize: number = 1000;
const defaultPrecision: number = 4;
const mesh = new TriangleMesh(canvasSize,defaultPrecision,surface);


const triangleNormals = getNormals(mesh);
//const triangleVertices = getVertices(mesh);
//console.log(triangleVertices);


const triangleVertices = new Float32Array([
    0,0,100,
    250,250,0,
    0,250,0,
    0,0,100,
    -250,-250,0,
    0,-250,0
]);


const rgbTriangleColors = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
]);


const xCameraSlider = document.getElementById("xCamera") as HTMLInputElement;
const yCameraSlider = document.getElementById("yCamera") as HTMLInputElement;
const zCameraSlider = document.getElementById("zCamera") as HTMLInputElement;
if(xCameraSlider == null || yCameraSlider == null || zCameraSlider == null) {
    throw new Error("CameraSlidersError");
}

var xCamera: number = 0;
var yCamera: number = 0;
var zCamera: number = 200;

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

var xCameraDirection: number = 0;
var yCameraDirection: number = 0;
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

function drawTriangles() {

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
    const reverseLightDirection = gl.getUniformLocation(drawTriangleProgram, 'reverseLightDirection');
    const worldViewProjectionLocation = gl.getUniformLocation(drawTriangleProgram, 'worldViewProjection');
    const worldLocation = gl.getUniformLocation(drawTriangleProgram, 'world');
    // need an error check

    // Output merger (how to apply an updated pixel to the output image)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    // Rasterizer (which output pixels are covered by a triangle?)
    gl.viewport(0, 0, canvas.width, canvas.height);

    // attatch all needed attributes
    gl.useProgram(drawTriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexColorAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);

    // Input assembler (how to read vertex information from buffers?)
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(vertexPositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(vertexNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer)
    gl.vertexAttribPointer(vertexColorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);


    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(60),canvas.clientWidth/canvas.clientHeight,1,2000);

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
    var worldMatrix = M4.scaling(1,1,1);

    // This matix first moves our obj <worldMatrix> then when it is set it moves it in front of the camera <viewMatix> and lastly clips it into space <projectionMatrix>
    var worldViewProjectionMatrix = M4.multiply(worldMatrix,viewProjectionMatrix);

    // Those matrices are responsible for validating normal vectors when scaling thie obj, possibly not needed
    //var worldInvMatix = worldMatrix.inverse();
    //var worldInvTransMatrix = worldInvMatix.transpose();

    gl.uniformMatrix4fv(worldLocation, false, worldMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    var vec = new Vec3(0.5,0.7,0.3);
    vec.normalize();
    gl.uniform3fv(reverseLightDirection, vec.getVec3ForBuffer());

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

drawTriangles();