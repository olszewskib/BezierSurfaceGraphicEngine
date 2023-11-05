import type { Vec3 } from "./vec3";
import type { Vec4 } from "./vec4";

export class Vertex {
    x: number;
    y: number;
    z: number;
    normal: Vec3 | undefined;
    color: Vec4 | undefined;

    constructor(x: number, y:number, z:number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setNormal(normal: Vec3) {
        this.normal = normal;
    }

    setColor(color: Vec4) {
        this.color = color; 
    }

    getVec3ForBuffer(): number[] {
        return new Array(this.x,this.y,this.z);
    }

    getVec2ForBuffer(): number[] {
        return new Array(this.x,this.y);
    }
}