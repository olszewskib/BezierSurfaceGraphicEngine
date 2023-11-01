import { Vec3 } from "./models/vec3";
import { Vertex } from "./models/vertex";
import { Triangle } from "./models/triangle";

export class TriangleMesh {
    size: number;
    precision: number;
    triangles: Triangle[];

    constructor( size: number, precision: number ) {
        this.size = size;
        this.precision = precision;
        this.triangles = [];
        this.construct();
    }

    construct(): void {
        var edgeLenght: number = this.size/this.precision;

        for(let i=0; i<this.precision; i++) {
            for(let j=0; j<this.precision; j++) {

                // Default z value is 0 and normal vector is [0,0,1] iow pointing up
                
                var p1 = new Vertex(edgeLenght * j, edgeLenght * i,0);
                p1.setNormal(new Vec3(0,0,1));

                var p2 = new Vertex(edgeLenght * j, edgeLenght * (i+1),0);
                p2.setNormal(new Vec3(0,0,1));

                var p3 = new Vertex(edgeLenght * (j+1), edgeLenght * (i+1),0);
                p3.setNormal(new Vec3(0,0,1));

                var t = new Triangle(p1,p2,p3);
                this.triangles.push(t);
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