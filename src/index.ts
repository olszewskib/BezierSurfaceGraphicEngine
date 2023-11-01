import { BezierSurface } from "./BezierSurface";
import { fragmentShaderSourceCode } from "./lib/fragmentShader";
import { vertexShaderSourceCode } from "./lib/vertexShader";
import { M4 } from "./m4";
import { Triangle } from "./models/triangle";
import { TriangleMesh } from "./triangleMesh";
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
    drawTriangles(precision);
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


function getNormals(mesh: TriangleMesh) {

    var normals: number[] = new Array();

    mesh.triangles.forEach( triangle => {
        if(!triangle.p1.normal || !triangle.p2.normal || !triangle.p3.normal) {
            throw new Error("VertexNormalIsUndefined");
        }

        var p1 = triangle.p1.normal.getVec3ForBuffer();
        normals.push(...p1)
        var p2 = triangle.p2.normal.getVec3ForBuffer();
        normals.push(...p2)
        var p3 = triangle.p3.normal.getVec3ForBuffer();
        normals.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(normals);
    return cpuBuffer;
}

const canvasSize: number = 1000;
const defaultPrecision: number = 4;
const mesh = new TriangleMesh(canvasSize,defaultPrecision);


const triangelNormals = getNormals(mesh);
const triangleVertices = new Float32Array([
    0,0,0,
    0,500,0,
    500,500,0
]);
const rgbTriangleColors = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
]);



function drawTriangles(precision: number) {

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
    const normalsBuffer = createStaticVertexBuffer(gl, triangelNormals)


    // Attribute locations
    const vertexPositionAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexPosition');
    const vertexColorAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexColor');
    const vertexNormalAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexNormal');
    if (vertexPositionAttributeLocation < 0 || vertexColorAttributeLocation < 0 || vertexNormalAttributeLocation < 0) return;

    // Uniform locations
    const transformationMatrix = gl.getUniformLocation(drawTriangleProgram, 'matrix');
    const reverseLightDirection = gl.getUniformLocation(drawTriangleProgram, 'reverseLightDirection');
    if(reverseLightDirection === null) {
        console.log('Uniforms error');
        return;
    }   

    // Output merger (how to apply an updated pixel to the output image)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
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


    //gl.uniform3f(reverseLightDirection, 0.37,0.53,0.75);
    gl.uniform3f(reverseLightDirection, 0,0,0.5);

    var mat4 = M4.project(canvas.clientWidth,canvas.clientHeight,400);
    mat4 = M4.multiply(M4.scaling(1,1,1),mat4);
    mat4 = M4.multiply(M4.translation(100,0,0),mat4);
    gl.uniformMatrix4fv(transformationMatrix, false, mat4.convert());


    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

drawTriangles(4);