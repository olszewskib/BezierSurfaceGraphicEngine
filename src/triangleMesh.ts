import { Vec3 } from "./models/vec3";
import { Vertex } from "./models/vertex";
import { Triangle } from "./models/triangle";
import { BezierSurface } from "./BezierSurface";

export class TriangleMesh {
    size: number;
    precision: number;
    triangles: Triangle[];
    surface:BezierSurface;

    constructor(precision: number, surface: BezierSurface ) {
        this.size = 1;
        this.precision = precision;
        this.triangles = [];
        this.surface = surface;
        this.construct(this.precision);
    }

    construct(precision: number): void {
        this.triangles = [];
        this.precision = precision;
        var edgeLenght: number = this.size/this.precision;

        for(let i=0; i<this.precision; i++) {
            for(let j=0; j<this.precision; j++) {

                // Default normal vector is [0,0,1] iow pointing up
                
                var p1 = new Vertex(edgeLenght * j, edgeLenght * i, this.surface.P(edgeLenght * j,edgeLenght * i));
                p1.setNormal(new Vec3(0,0,1));

                var p2 = new Vertex(edgeLenght * j, edgeLenght * (i+1), this.surface.P(edgeLenght * j,edgeLenght * (i+1)));
                p2.setNormal(new Vec3(0,0,1));

                var p3 = new Vertex(edgeLenght * (j+1), edgeLenght * (i+1), this.surface.P(edgeLenght * (j+1),edgeLenght * (i+1)));
                p3.setNormal(new Vec3(0,0,1));

                var tLow = new Triangle(p1,p2,p3);
                this.triangles.push(tLow);

                /*
                var p4 = new Vertex(edgeLenght * (j+1), edgeLenght * i, this.surface.P(edgeLenght * (j+1), edgeLenght * i));
                p4.setNormal(new Vec3(0,0,1));

                var tHigh = new Triangle(p1,p3,p4);
                this.triangles.push(tHigh);
                */
            }
        }
    }
}

export function getNormals(mesh: TriangleMesh): Float32Array {

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

    /*
    for(let i:number = 0; i<mesh.triangles.length; i+=2) {
        var triangle:Triangle = mesh.triangles[i];
        var closer:Triangle = mesh.triangles[i+1];

        if(!triangle.p1.normal || !triangle.p2.normal || !triangle.p3.normal || !closer.p3.normal) {
            throw new Error("VertexNormalIsUndefined");
        }

        var p1 = triangle.p1.normal.getVec3ForBuffer();
        normals.push(...p1)
        var p2 = triangle.p2.normal.getVec3ForBuffer();
        normals.push(...p2)
        var p3 = triangle.p3.normal.getVec3ForBuffer();
        normals.push(...p3)
        var p4 = closer.p3.normal.getVec3ForBuffer();
        normals.push(...p4);
    }
    */

    var cpuBuffer: Float32Array = new Float32Array(normals);
    return cpuBuffer;
}

export function getColors(mesh: TriangleMesh): Uint8Array {
    
    var colors: number[] = new Array();
    for(let i:number = 0; i<mesh.triangles.length; i++) {

        colors.push(255,0,0);
        colors.push(0,255,0);
        colors.push(0,0,255);
        //colors.push(100,100,100);
    }

    var cpuBuffer: Uint8Array = new Uint8Array(colors);
    return cpuBuffer;

}

export function getVertices(mesh: TriangleMesh): Float32Array {

    var vertices: number[] = new Array();

    mesh.triangles.forEach( triangle => {
        if(!triangle.p1.normal || !triangle.p2.normal || !triangle.p3.normal) {
            throw new Error("VertexNormalIsUndefined");
        }

        var p1 = triangle.p1.getVec3ForBuffer();
        vertices.push(...p1)
        var p2 = triangle.p2.getVec3ForBuffer();
        vertices.push(...p2)
        var p3 = triangle.p3.getVec3ForBuffer();
        vertices.push(...p3)
    })

    /*
    for(let i:number = 0; i<mesh.triangles.length; i+=2) {
        var triangle:Triangle = mesh.triangles[i];
        var closer:Triangle = mesh.triangles[i+1];

        var p1 = triangle.p1.getVec3ForBuffer();
        vertices.push(...p1)
        var p2 = triangle.p2.getVec3ForBuffer();
        vertices.push(...p2)
        var p3 = triangle.p3.getVec3ForBuffer();
        vertices.push(...p3)
        var p4 = closer.p3.getVec3ForBuffer();
        vertices.push(...p4);
    }
    */

    var cpuBuffer: Float32Array = new Float32Array(vertices);
    return cpuBuffer;
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