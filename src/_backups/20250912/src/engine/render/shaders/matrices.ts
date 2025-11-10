
  // Taken from www.webglfundamentals.com or something

export default class Matrix {
  public static iM = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  public static ortho(x:number,y:number,z:number,w:number,h:number,d:number) : Float32Array{


    return new Float32Array([
      w, 0, 0, 0,
      0, h, 0, 0, 
      0, 0, d, 0, 
      x, y, z, 1
    ])
  }

  public static multiplyMatrices(matrixA, matrixB) {
    // Slice the second matrix up into rows
    let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
    let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
    let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
    let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];
  
    // Multiply each row by matrixA
    let result0 = this.multiplyMatrixAndPoint(matrixA, row0);
    let result1 = this.multiplyMatrixAndPoint(matrixA, row1);
    let result2 = this.multiplyMatrixAndPoint(matrixA, row2);
    let result3 = this.multiplyMatrixAndPoint(matrixA, row3);
  
    // Turn the result rows back into a single matrix
    return new Float32Array([
      result0[0],
      result0[1],
      result0[2],
      result0[3],
      result1[0],
      result1[1],
      result1[2],
      result1[3],
      result2[0],
      result2[1],
      result2[2],
      result2[3],
      result3[0],
      result3[1],
      result3[2],
      result3[3]
    ]);
  }
  
  public static multiplyMatrixAndPoint(matrix, point) {
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix[0],
      c1r0 = matrix[1],
      c2r0 = matrix[2],
      c3r0 = matrix[3];
    let c0r1 = matrix[4],
      c1r1 = matrix[5],
      c2r1 = matrix[6],
      c3r1 = matrix[7];
    let c0r2 = matrix[8],
      c1r2 = matrix[9],
      c2r2 = matrix[10],
      c3r2 = matrix[11];
    let c0r3 = matrix[12],
      c1r3 = matrix[13],
      c2r3 = matrix[14],
      c3r3 = matrix[15];
  
    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];
  
    // Multiply the point against each part of the 1st column, then add together
    let resultX = x * c0r0 + y * c0r1 + z * c0r2 + w * c0r3;
  
    // Multiply the point against each part of the 2nd column, then add together
    let resultY = x * c1r0 + y * c1r1 + z * c1r2 + w * c1r3;
  
    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = x * c2r0 + y * c2r1 + z * c2r2 + w * c2r3;
  
    // Multiply the point against each part of the 4th column, then add together
    let resultW = x * c3r0 + y * c3r1 + z * c3r2 + w * c3r3;
  
    return [resultX, resultY, resultZ, resultW];
  }

  public static rotation(dst, radians){


    return this.multiplyMatrices(dst, [
      Math.cos(radians),-Math.sin(radians),0,0,
      Math.sin(radians),Math.cos(radians),0,0,
      0,0,1,0,
      0,0,0,1,
    ]) ;
  }
  public static normalize(dst, width, height){

    dst[0]  =  dst[0]  / width  ;
    dst[5]  =  dst[5]  / height ;
    dst[12] =  dst[12] / width  ;
    dst[13] =  dst[13] / height ;

    return dst;
    
  }
  
  public static orthographic(left, right, bottom, top, near, far, dst = new Float32Array(16)) {

    dst[ 0] = 2 / (right - left);
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 2 / (top - bottom);
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  }

  public static scale(m, sx, sy, sz, dst = new Float32Array(16)) {

    dst[ 0] = sx * m[0 * 4 + 0];
    dst[ 1] = sx * m[0 * 4 + 1];
    dst[ 2] = sx * m[0 * 4 + 2];
    dst[ 3] = sx * m[0 * 4 + 3];
    dst[ 4] = sy * m[1 * 4 + 0];
    dst[ 5] = sy * m[1 * 4 + 1];
    dst[ 6] = sy * m[1 * 4 + 2];
    dst[ 7] = sy * m[1 * 4 + 3];
    dst[ 8] = sz * m[2 * 4 + 0];
    dst[ 9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  }

  public static translate(m, tx, ty, tz, dst = new Float32Array(16)) {

    var m00 = m[0];
    var m01 = m[1];
    var m02 = m[2];
    var m03 = m[3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];

    if (m !== dst) {
      dst[ 0] = m00;
      dst[ 1] = m01;
      dst[ 2] = m02;
      dst[ 3] = m03;
      dst[ 4] = m10;
      dst[ 5] = m11;
      dst[ 6] = m12;
      dst[ 7] = m13;
      dst[ 8] = m20;
      dst[ 9] = m21;
      dst[10] = m22;
      dst[11] = m23;
    }

    dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
    dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
    dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
    dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

    return dst;
  }

  public static mat4mul(lefthand:Float32Array, righthand:Float32Array): Float32Array{
    const result = [];
    
    for (let row = 0; row < 4; row++){
        for(let col = 0; col < 4; col++){
            const value = lefthand[row*4 + 0]*righthand[0*4 + col]
                        + lefthand[row*4 + 1]*righthand[1*4 + col]
                        + lefthand[row*4 + 2]*righthand[2*4 + col]
                        + lefthand[row*4 + 3]*righthand[3*4 + col];
            
            result[row*4 + col] = value;
        }
    }
    
    return new Float32Array(result);
  }

  public static mat4translation(point:{x:number,y:number}): Float32Array{
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        point.x, point.y, 0.0, 1.0
    ]);
  }

  public static mat4rot(radians: number): Float32Array{


    return new Float32Array([
      Math.cos(radians),-Math.sin(radians),0,0,
      Math.sin(radians),Math.cos(radians),0,0,
      0,0,1,0,
      0,0,0,1,
    ]) ;
  }
}
