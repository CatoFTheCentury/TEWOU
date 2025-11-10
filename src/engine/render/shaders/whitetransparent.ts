import * as T from "../../_type"
import Shader from "../_shaders"

import Matrix from "./matrices"
import {Composite} from '../composite';


export default class WhiteTransparent extends Shader {
  public program : WebGLProgram;
  public name : string = "whitetransparent";
  public matrixLocation : WebGLUniformLocation;
  public textureMatrixLocation : WebGLUniformLocation;
  public texture : WebGLUniformLocation;
  
    public second : Array<()=>void> = [
      () => {}]
    public first : Array<()=>void> = [
      () => {
        let gl : WebGL2RenderingContext = Shader.gl;
        // DefaultShader.gl.activeTexture(DefaultShader.gl.TEXTURE0);
        let aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
        gl.enableVertexAttribArray(aVertexPosition);
        gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0 , 0);

        let texCoordLocation = gl.getAttribLocation(this.program, "texcoordLocation");
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        this.matrixLocation = gl.getUniformLocation(this.program, "matrixLocation")!;
        this.textureMatrixLocation = gl.getUniformLocation(this.program, "textureMatrixLocation")!;
        // this.texture = gl.getUniformLocation(this.program, "texture");
      },
    ]
      public passes : Array<(cmp: Composite.Renderable, plane: T.Box)=>void> = [
        (cmp: Composite.Image, plane: T.Box) => {
          let gl : WebGL2RenderingContext = Shader.gl;
          // gl.activeTexture(gl.TEXTURE0);
          // gl.bindTexture(gl.TEXTURE_2D, cmp.texture);
          // gl.uniform1i(this.texture, 0);
          // let matrix = Matrix.orthographic(-1, 1, 1, -1, -1,1);
          // matrix = Matrix.scale(matrix,cmp.rprops.dstrect.w,cmp.rprops.dstrect.h,1);
          // matrix = Matrix.translate(matrix,cmp.rprops.dstrect.x,cmp.rprops.dstrect.y,1);

        let funtimes = new Float32Array(
          [cmp.rprops.dstrect.w,0,0,0,
            0,cmp.rprops.dstrect.h,0,0,
            0,0,1,0,
            cmp.rprops.dstrect.x, plane.h-cmp.rprops.dstrect.y-cmp.rprops.dstrect.h,0,1]
        )
        // if(cmp.rprops.scalex != 1){
        //   funtimes[0]  *= cmp.rprops.scalex;
        //   funtimes[12] += cmp.rprops.dstrect.w - ((cmp.rprops.dstrect.w * cmp.rprops.scalex) / 2);
        // }
        // if(cmp.rprops.scaley != 1){
        //   funtimes[4]  *= cmp.rprops.scaley;
        //   funtimes[13] += cmp.rprops.scaley;
        // }
        if(cmp.rprops.angle!=0){ 
          // TODO: rotate around a point
          let twomat : Array<number> = [];
          twomat[0] = ( Math.cos(-cmp.rprops.angle) * funtimes[0]);
          twomat[1] = (-Math.sin(-cmp.rprops.angle) * funtimes[0]);
          twomat[3] = ( Math.sin(-cmp.rprops.angle) * funtimes[5]);
          twomat[4] = ( Math.cos(-cmp.rprops.angle) * funtimes[5]);
          
          funtimes[0] = twomat[0];
          funtimes[1] = twomat[1];
          funtimes[4] = twomat[3];
          funtimes[5] = twomat[4];
        }


        // Math.cos(radians),-Math.sin(radians)
        // Math.sin(radians), Math.cos(radians)
        
        
        funtimes[0]  *=  2/plane.w;
        funtimes[1]  *=  2/plane.w;
        // funtimes[3]  *=  (funtimes[3] * (2/plane.w));
        funtimes[4]  *=  -2/plane.h;
        funtimes[5]  *= -2/plane.h;
        funtimes[12]  =  (funtimes[12]*(2/plane.w))-1;
        funtimes[13]  = -(funtimes[13]*(2/plane.h))+1;
        
        // funtimes = Matrix.translate()
        // funtimes[12]  -= (2*cmp.rprops.rotcenter.x)/plane.w;
        // funtimes[13]  -= (2*cmp.rprops.rotcenter.y)/plane.h;
        // funtimes = Matrix.rotation(funtimes,cmp.rprops.angle);
        // funtimes[12]  += (2*cmp.rprops.rotcenter.x)/plane.w;
        // funtimes[13]  += (2*cmp.rprops.rotcenter.y)/plane.h;
        
        gl.uniformMatrix4fv(this.matrixLocation, false, funtimes);
          // console.log("FDS)")

        if(this.textureMatrixLocation != null){
          // let texMatrix = new Float32Array(
          //   [cmp.rprops.srcrect.w,0,0,0,
          //     0,cmp.rprops.srcrect.h,0,0,
          //     0,0,1,0,
          //     cmp.rprops.srcrect.x, cmp.rprops.srcrect.y,0,1]
          // )
          // texMatrix[0]  *=  2/cmp.rprops.dstrect.w;
          // texMatrix[5]  *= -2/cmp.rprops.dstrect.h;
          // texMatrix[12]  =  (texMatrix[12]*(2/cmp.rprops.dstrect.w))-1;
          // texMatrix[13]  = -(texMatrix[13]*(2/cmp.rprops.dstrect.h))+1;
          let texMatrix = Matrix.orthographic(-1, 1, -1,1,  -1,1);
            texMatrix = Matrix.translate(texMatrix,0,1,0);


          if(cmp.rprops.flip.flipx && cmp.rprops.flip.flipy){

          } else if(cmp.rprops.flip.flipx){
            texMatrix = Matrix.orthographic(1, -1, -1,1,  -1,1);
            texMatrix = Matrix.translate(texMatrix,-1,1,0);
          } else if(cmp.rprops.flip.flipy){
            
          }
          // console.log("FDS)")
          // let texMatrix = Matrix.orthographic(-1, 1, -1,1,  -1,1);
          gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
        }
      }
    ]

}