import { BezierSurface } from "./BezierSurface";
import { drawTriangleMesh } from "./triangleMesh";

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const slider = document.getElementById("precisionSlider") as HTMLInputElement;
const sliderValue = document.getElementById("sliderValue");

if(slider == null)
    throw new Error("slider not found");
if(sliderValue == null)
    throw new Error("slider not found");
if(ctx == null)
  throw new Error("context not found");

drawTriangleMesh(ctx,canvas.width,parseInt(slider.value,10));

slider.addEventListener("input", function() {
    sliderValue.textContent = "Precision: " + slider.value;
    let precision = parseInt(slider.value,10);
    drawTriangleMesh(ctx, canvas.width, precision);
});



const surface = new BezierSurface();


// mod z values of BeziersSurface


const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

if(zSlider == null)
    throw new Error("slider not found");

zSlider.addEventListener("input", function() {

    surface.setControlPointZValue(parseInt(xIndex.value,10),parseInt(yIndex.value,10),parseFloat(zSlider.value));

    var index = xIndex.value + yIndex.value;
    const cell = document.getElementById(index);
    if(cell) {
        cell.textContent = zSlider.value;
    }
    
})