export class M4 {
    readonly degree = 4;
    values: number[][];
    
    constructor() {
        this.values = [];
        for(var i:number =0; i < this.degree; i++) {
            this.values[i] = [];
            for(var j:number = 0; j < this.degree; j++) {
                this.values[i][j] = 0;
            }
        }
    }

    static translation(dx: number,dy: number,dz: number): M4 {
        var transaltionMatrix = new M4();

        transaltionMatrix.values[0][0] = 1;
        transaltionMatrix.values[1][1] = 1;
        transaltionMatrix.values[2][2] = 1;
        transaltionMatrix.values[3][3] = 1;
        
        transaltionMatrix.values[3][0] = dx;
        transaltionMatrix.values[3][1] = dy;
        transaltionMatrix.values[3][2] = dz;

        return transaltionMatrix;
    }

    static rotationX(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = 1;

        rotationMatrix.values[1][1] = c;
        rotationMatrix.values[1][2] = s;

        rotationMatrix.values[2][1] = -s;
        rotationMatrix.values[2][2] = c;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static rotationY(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = c;
        rotationMatrix.values[0][2] = -s;

        rotationMatrix.values[1][1] = 1;

        rotationMatrix.values[2][0] = s;
        rotationMatrix.values[2][2] = c;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static rotationZ(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = c;
        rotationMatrix.values[0][1] = s;

        rotationMatrix.values[1][0] = -s;
        rotationMatrix.values[1][1] = c;

        rotationMatrix.values[2][2] = 1;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static scaling(sx: number, sy: number, sz: number): M4 {
        var scaledMatrix = new M4();
        
        scaledMatrix.values[0][0] = sx;
        scaledMatrix.values[1][1] = sy;
        scaledMatrix.values[2][2] = sz;
        scaledMatrix.values[3][3] = 1;

        return scaledMatrix;
    }

    static multiply(A: M4, B: M4): M4 {
        var a = A.values;
        var b = B.values;
        var result = new M4();

        result.values[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0] + a[0][3] * b[3][0];
        result.values[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1] + a[0][3] * b[3][1];
        result.values[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2] + a[0][3] * b[3][2];
        result.values[0][3] = a[0][0] * b[0][3] + a[0][1] * b[1][3] + a[0][2] * b[2][3] + a[0][3] * b[3][3];

        result.values[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0] + a[1][3] * b[3][0];
        result.values[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1] + a[1][3] * b[3][1];
        result.values[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2] + a[1][3] * b[3][2];
        result.values[1][3] = a[1][0] * b[0][3] + a[1][1] * b[1][3] + a[1][2] * b[2][3] + a[1][3] * b[3][3];

        result.values[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0] + a[2][3] * b[3][0];
        result.values[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1] + a[2][3] * b[3][1];
        result.values[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2] + a[2][3] * b[3][2];
        result.values[2][3] = a[2][0] * b[0][3] + a[2][1] * b[1][3] + a[2][2] * b[2][3] + a[2][3] * b[3][3];

        result.values[3][0] = a[3][0] * b[0][0] + a[3][1] * b[1][0] + a[3][2] * b[2][0] + a[3][3] * b[3][0];
        result.values[3][1] = a[3][0] * b[0][1] + a[3][1] * b[1][1] + a[3][2] * b[2][1] + a[3][3] * b[3][1];
        result.values[3][2] = a[3][0] * b[0][2] + a[3][1] * b[1][2] + a[3][2] * b[2][2] + a[3][3] * b[3][2];
        result.values[3][3] = a[3][0] * b[0][3] + a[3][1] * b[1][3] + a[3][2] * b[2][3] + a[3][3] * b[3][3];

        return result;
    }

    static project(w: number, h: number, d: number): M4 {
        var result = new M4();

        result.values[0][0] = 2/w;
        result.values[1][1] = -2/h;
        result.values[2][2] = 2/d;
        result.values[3][0] = -1;
        result.values[3][1] = 1;
        result.values[3][3] = 1;

        return result;
    }

    convert(): number[] {
        var result = [];
        for(var i:number =0; i < this.degree; i++) {
            for(var j:number = 0; j < this.degree; j++) {
                result.push(this.values[i][j]);
            }
        }
        return result;
    }
}