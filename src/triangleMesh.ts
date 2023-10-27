export function drawTriangle(context: CanvasRenderingContext2D, sliderValue: number, perecision: number){
    // Define the coordinates for the triangle's vertices
    console.log(sliderValue);
    console.log(perecision);

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = perecision;
    let x3 = perecision;
    let y3 = perecision;

    // Set the triangle's stroke color
    context.strokeStyle = "blue";

    for(let i=0; i<sliderValue; i++) {
        for(let j=0; j<sliderValue; j++) {

            x1 = perecision * j;
            y1 = perecision * i;

            x2 = perecision * j;
            y2 = perecision * i;

            x3 = perecision * j;
            y3 = perecision * i;

            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.closePath();

            context.stroke();
            //console.log(i);
            //console.log(j);
        }
    }
}