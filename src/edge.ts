import { BresLine } from "./bresenhamAlg";
import { Point } from "./point";

export class Edge {

    start: Point;
    end: Point;
    points: Array<Point>;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
        this.points = BresLine.rasrtizeEdge(this);
    }
    
    // idea: would making points load lazily make things faster ?

}