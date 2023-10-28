import { drawTriangleMesh } from "./triangleMesh";

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");


//if(ctx){
//  for(let i=0; i<canvas.height; i++){
//    for(let j=0; j<canvas.width; j++){
//      ctx.moveTo(i,j);
//      ctx.lineTo(i,j+1);
//    }
//  }
//  // so far the fastest way to drwa looking for sth faster
//  ctx.stroke();
//}


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