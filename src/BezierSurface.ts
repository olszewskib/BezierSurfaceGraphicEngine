type Point3D = {
    x: number;
    y: number;
    z: number;
};


export class BezierSurface {
    readonly degree = 3;
    controlPoints: Point3D[][];

    constructor() {
        this.controlPoints = [];

        var x:number = 0;
        var y:number = 0;
        var z:number = 0;
        
        for(var i:number =0; i <= this.degree; i++) {
            this.controlPoints[i] = [];
            for(var j:number = 0; j <= this.degree; j++) {
                this.controlPoints[i][j] = {x: x, y: y, z: z};
                x+=(1/this.degree);
            }
            x=0;
            y+=(1/this.degree);
        }
    }

    setControlPointZValue(i: number, j: number, newZ: number) {

        // message that you cant change conrner values
        if(i == 0 && j == 0) return;
        if(i == 3 && j == 0) return;
        if(i == 0 && j == 3) return;
        if(i == 3 && j == 3) return;

        this.controlPoints[i][j].z = newZ;
    }

}