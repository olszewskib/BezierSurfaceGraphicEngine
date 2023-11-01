export class Vec3 {
    v1: number;
    v2: number;
    v3: number;

    constructor(v1:number, v2:number, v3:number) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    getVec3ForBuffer(): number[] {
        return new Array(this.v1,this.v2,this.v3);
    }
}