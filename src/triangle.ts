import { Point } from "./point";

export class Triangle {
    p1: Point;
    p2: Point;
    p3: Point;

    constructor(p1: Point, p2: Point, p3: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    getVertices(): number[] {
        const arr = [];
        arr.push(this.p1.x);
        arr.push(this.p1.y);
        arr.push(this.p2.x);
        arr.push(this.p2.y);
        arr.push(this.p3.x);
        arr.push(this.p3.y);
        return arr;
    }
}