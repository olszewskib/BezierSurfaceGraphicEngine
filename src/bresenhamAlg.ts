import { Edge } from "./edge";
import { Point } from "./point";

export class BresLine {
    
    static rasrtizeEdge(edge: Edge): Array<Point> {

        var x1: number = Math.round(edge.start.x);
        var y1: number = Math.round(edge.start.y);
        var x2: number = Math.round(edge.end.x);
        var y2: number = Math.round(edge.end.y);

        // it remains to be checked if this rounding is correct

        var dx: number = Math.abs(x2-x1);
        var dy: number = Math.abs(y2-y1);
        var sx: number = x1 < x2 ? 1 : -1;
        var sy: number = y1 < y2 ? 1 : -1;
        var err: number = dx-dy;

        var points: Array<Point> = new Array<Point>();

        while(true) {
            points.push(new Point(x1,y1));

            if(x1 == x2 && y1 == y2) break;

            var e2 = err * 2;
            if(e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if(e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }

        return points;
    }
}