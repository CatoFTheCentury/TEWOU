import * as T from "../../_type"
import Shader from "../_shaders"

import Matrix from "./matrices"
import {Composite} from '../composite';
import Template from "./template"


export class WhiteTransparent extends Template {
  public program : WebGLProgram;
  public name : string = "whitetransparent";
  private matrixLocation : WebGLUniformLocation;
  private textureMatrixLocation : WebGLUniformLocation;
  // public texture : WebGLUniformLocation;
  
    public second : Array<()=>void> = [
      () => {}]
    public first : Array<(ctx:WebGL2RenderingContext)=>void> = [
      (ctx:WebGL2RenderingContext) => {
        let gl = ctx;
        let aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
        gl.enableVertexAttribArray(aVertexPosition);
        gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0 , 0);

        let texCoordLocation = gl.getAttribLocation(this.program, "texcoordLocation");
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        this.matrixLocation = gl.getUniformLocation(this.program, "matrixLocation")!;
        this.textureMatrixLocation = gl.getUniformLocation(this.program, "textureMatrixLocation")!;
      },
    ]
      public passes : Array<(ctx:WebGL2RenderingContext, cmp: Composite.Renderable, plane: T.Box, extraarguments : T.ExtraShaderArguments)=>void> = [
        (ctx:WebGL2RenderingContext, cmp: Composite.Image, plane: T.Box, extraarguments : T.ExtraShaderArguments) => {
          let gl = ctx;

        let positionmatrix = new Float32Array(
          [cmp.rprops.dstrect.w,0,0,0,
            0,cmp.rprops.dstrect.h,0,0,
            0,0,1,0,
            cmp.rprops.dstrect.x, plane.h-cmp.rprops.dstrect.y-cmp.rprops.dstrect.h,0,1]
        )

        
        positionmatrix[0]  *=  2/plane.w;
        positionmatrix[1]  *=  2/plane.w;
        positionmatrix[4]  *=  -2/plane.h;
        positionmatrix[5]  *= -2/plane.h;
        positionmatrix[12]  =  (positionmatrix[12]*(2/plane.w))-1;
        positionmatrix[13]  = -(positionmatrix[13]*(2/plane.h))+1;
        
        
        gl.uniformMatrix4fv(this.matrixLocation, false, positionmatrix);

        if(this.textureMatrixLocation != null){
          let texMatrix = Matrix.orthographic(-1, 1, -1,1,  -1,1);
            texMatrix = Matrix.translate(texMatrix,0,1,0);


          if(cmp.rprops.flip.flipx && cmp.rprops.flip.flipy){

          } else if(cmp.rprops.flip.flipx){
            texMatrix = Matrix.orthographic(1, -1, -1,1,  -1,1);
            texMatrix = Matrix.translate(texMatrix,-1,1,0);
          } else if(cmp.rprops.flip.flipy){
            
          }
          gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
        }
      }
    ]

}