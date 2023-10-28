import { Point } from "./point";
import { Triangle } from "./triangle";

class TriangleMesh {
    size: number;
    precision: number;
    context: CanvasRenderingContext2D;

    constructor(size: number, precision: number, context: CanvasRenderingContext2D) {
        this.size = size;
        this.precision = precision;
        this.context = context;
    }

    render(): void {
        this.context.clearRect(0,0,this.size,this.size);
        var edgeLenght: number = this.size/this.precision;

        for(let i=0; i<this.precision; i++) {
            for(let j=0; j<this.precision; j++) {

                var p1 = new Point(edgeLenght * j, edgeLenght * i);
                var p2 = new Point(edgeLenght * j, edgeLenght * (i+1));
                var p3 = new Point(edgeLenght * (j+1), edgeLenght * (i+1));

                var t = new Triangle(p1,p2,p3);
                drawTriangle(this.context,t);
            }
        }
    }
}

function drawTriangle(context: CanvasRenderingContext2D, triangle: Triangle){

    context.strokeStyle = "black";
    context.beginPath();

    context.moveTo(triangle.p1.x,triangle.p1.y);
    context.lineTo(triangle.p2.x,triangle.p2.y);
    context.lineTo(triangle.p3.x,triangle.p3.y);

    context.closePath();
    context.stroke();
}

export function drawTriangleMesh(context: CanvasRenderingContext2D, size: number, precision: number) {

    var triangleMesh = new TriangleMesh(size,precision,context);
    triangleMesh.render();
}