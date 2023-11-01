import { BezierSurface } from "./BezierSurface";
import { fragmentShaderSourceCode } from "./lib/fragmentShader";
import { vertexShaderSourceCode } from "./lib/vertexShader";
import { Triangle } from "./triangle";
import { TriangleMesh } from "./triangleMesh";

// elements 
//const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
//const ctx = canvas.getContext("2d");

const slider = document.getElementById("precisionSlider") as HTMLInputElement;
const sliderValue = document.getElementById("sliderValue");

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

// check for null
//if(ctx == null)
//  throw new Error("context not found");
if(slider == null)
    throw new Error("slider not found");
if(sliderValue == null)
    throw new Error("slider not found");
if(zSlider == null)
    throw new Error("slider not found");

// triangle mesth
//var mesh = new TriangleMesh(ctx,canvas.width,parseInt(slider.value,10));
//mesh.render();

/*
slider.addEventListener("input", function() {
    sliderValue.textContent = "Precision: " + slider.value;
    let precision = parseInt(slider.value,10);
    mesh = new TriangleMesh(ctx,canvas.width,precision);
    mesh.render();
});
*/

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

const triangleVertices = new Float32Array([-1.0,1.0,-1.0,0.0,0.0,0.0]);
const rgbTriangleColors = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
]);

function createStaticVertexBuffer(gl: WebGL2RenderingContext, data: ArrayBuffer) {
    const buffer = gl.createBuffer();
    if(!buffer) {
        throw new Error('BufferCreationError');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}

function helloTriangles() {

    const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
    if(!canvas) {
        throw new Error("Cant find canvas");
    }

    // getting gl context
    const gl = canvas.getContext('webgl2');
    if(!gl) {
        throw new Error("webGL not supported");
    }

    /*
    var mesh = new TriangleMesh(canvas.width,parseInt(slider.value,10));
    mesh.render();

    const triangleVertices = mesh.triangles[0].getVertices();
    triangleVertices.push(...mesh.triangles[1].getVertices());
    */


    // next we create a buffer, bind it aka allocate memory, and copy data to it buffer data
    const triangleBuffer = createStaticVertexBuffer(gl, triangleVertices);
    const rgbTriabgleBuffer = createStaticVertexBuffer(gl, rgbTriangleColors);


    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if(!vertexShader) return;
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        console.log(errorMessage);
        return;
    }

  
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if(!fragmentShader) return;
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        console.log(errorMessage);
        return;
    } 


    const helloTriangleProgram = gl.createProgram();
    if(!helloTriangleProgram) return;
    gl.attachShader(helloTriangleProgram, vertexShader);
    gl.attachShader(helloTriangleProgram, fragmentShader);
    gl.linkProgram(helloTriangleProgram);
    if (!gl.getProgramParameter(helloTriangleProgram, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(helloTriangleProgram);
        console.log(errorMessage);
        return;
    }

    // Attribute locations
    const vertexPositionAttributeLocation = gl.getAttribLocation(helloTriangleProgram, 'vertexPosition');
    const vertexColorAttributeLocation = gl.getAttribLocation(helloTriangleProgram, 'vertexColor');
    if (vertexPositionAttributeLocation < 0 || vertexColorAttributeLocation < 0) return;

    // Uniform locations
    const shapeLocationUniform = gl.getUniformLocation(helloTriangleProgram, 'shapeLocation');
    const shapeSizeUniform = gl.getUniformLocation(helloTriangleProgram, 'shapeSize');
    const canvasSizeUniform = gl.getUniformLocation(helloTriangleProgram, 'canvasSize');
    if(shapeLocationUniform === null || shapeSizeUniform === null || canvasSizeUniform === null) {
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

    gl.useProgram(helloTriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexColorAttributeLocation);

    // Input assembler (how to read vertex information from buffers?)
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(
    /* index: vertex attrib location */
    vertexPositionAttributeLocation,
    /* size: number of components in the attribute */
    2,
    /* type: type of data in the GPU buffer for this attribute */
    gl.FLOAT,
    /* normalized: if type=float and is writing to a vec(n) float input, should WebGL normalize the ints first? */
    false,
    /* stride: bytes between starting byte of attribute for a vertex and the same attrib for the next vertex */
    2 * Float32Array.BYTES_PER_ELEMENT,
    /* offset: bytes between the start of the buffer and the first byte of the attribute */
    0
    );

    gl.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer)
    gl.vertexAttribPointer(
        vertexColorAttributeLocation,
        3, gl.UNSIGNED_BYTE, true, 0, 0);

    // Draw call (Primitive assembly (which vertices form triangles together?))
    gl.uniform1f(shapeSizeUniform,500);
    gl.uniform2f(shapeLocationUniform,500,500);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // draw second triangle
    gl.uniform1f(shapeSizeUniform,500);
    gl.uniform2f(shapeLocationUniform,1000,500);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

helloTriangles();