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