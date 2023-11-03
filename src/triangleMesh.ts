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

                // north west vertex
                var nwX = edgeLenght * j;
                var nwY = edgeLenght * i; 
                // south west vertex
                var swX = nwX
                var swY = edgeLenght * (i+1); 
                // south east vertex
                var soX = edgeLenght * (j+1);
                var soY = swY;
                // north east vertex
                var neX = soX;
                var neY = nwY;

                var p1 = new Vertex(nwX, nwY, this.surface.P(nwX,nwY));
                p1.setNormal(Vec3.crossProduct(this.surface.dU(nwX,nwY),this.surface.dV(nwX,nwY)));
                p1.normal?.normalize();

                var p2 = new Vertex(swX, swY, this.surface.P(swX,swY));
                p2.setNormal(Vec3.crossProduct(this.surface.dU(swX,swY),this.surface.dV(swX,swY)));
                p2.normal?.normalize();

                var p3 = new Vertex(soX, soY, this.surface.P(soX,soY));
                p3.setNormal(Vec3.crossProduct(this.surface.dU(soX,soY),this.surface.dV(soX,soY)));
                p3.normal?.normalize();

                var tLow = new Triangle(p1,p2,p3);
                this.triangles.push(tLow);

                var p4 = new Vertex(nwX, nwY, this.surface.P(nwX,nwY));
                p4.setNormal(Vec3.crossProduct(this.surface.dU(nwX,nwY),this.surface.dV(nwX,nwY)));
                p4.normal?.normalize();

                var p5 = new Vertex(neX, neY, this.surface.P(neX,neY));
                p5.setNormal(Vec3.crossProduct(this.surface.dU(neX,neY),this.surface.dV(neX,neY)));
                p5.normal?.normalize();

                var p6 = new Vertex(soX, soY, this.surface.P(soX,soY));
                p6.setNormal(Vec3.crossProduct(this.surface.dU(soX,soY),this.surface.dV(soX,soY)));
                p6.normal?.normalize();

                var tHigh = new Triangle(p4,p5,p6);
                this.triangles.push(tHigh);
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