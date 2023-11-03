import type { Point3D } from "src/BezierSurface";

export class Vec3 {
    v1: number;
    v2: number;
    v3: number;

    constructor(v1:number = 0, v2:number = 0, v3:number = 0) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    static crossProduct(v: Vec3, u: Vec3): Vec3 {
        var x: number = v.v2 * u.v3 - v.v3 * u.v2;
        var y: number = v.v3 * u.v1 - v.v1 * u.v3;
        var z: number = v.v1 * u.v2 - v.v2 * u.v1;

        return new Vec3(x,y,z);
    }

    static subtractVectors(v: Vec3, u: Vec3): Vec3 {
        var x: number = v.v1 - u.v1;
        var y: number = v.v2 - u.v2;
        var z: number = v.v3 - u.v3;

        return new Vec3(x,y,z);
    }

    normalize(): void {
        var len: number = this.lenght()

        // we dont want to divide by 0
        if(len > 0.000001) {
            this.v1 /= len;
            this.v2 /= len;
            this.v3 /= len;
        } else {
            this.v1 = 0;
            this.v2 = 0;
            this.v3 = 0;
        }
    }

    static scale(v: Vec3, scalar: number): Vec3 {
        return new Vec3(
            v.v1*scalar,
            v.v2*scalar,
            v.v3*scalar
        );
    }

    static convertFromPoint3D(point: Point3D): Vec3 {
        return new Vec3(point.x,point.y,point.z);
    }

    add(v: Vec3): void {
        this.v1 += v.v1;
        this.v2 += v.v2;
        this.v3 += v.v3;
    }

    lenght(): number {
        return Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2 + this.v3 * this.v3);
    }

    getVec3ForBuffer(): number[] {
        return new Array(this.v1,this.v2,this.v3);
    }
}