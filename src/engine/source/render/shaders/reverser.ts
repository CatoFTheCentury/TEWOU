import * as T from "../../_type"
import Shader from "../_shaders"
import Template from "./template"

import Matrix from "./matrices"
import {Composite} from '../composite';


export class Reverser extends Template {
  public program : WebGLProgram;
  public name : string = "reverser";
  public matrixLocation : WebGLUniformLocation;
  public textureMatrixLocation : WebGLUniformLocation;
  public texture : WebGLUniformLocation;
  
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

        this.matrixLocation = gl.getUniformLocation(this.program, "matrixLocation");
        this.textureMatrixLocation = gl.getUniformLocation(this.program, "textureMatrixLocation");
        this.texture = gl.getUniformLocation(this.program, "texture");
      },
    ]
      public passes : Array<(ctx:WebGL2RenderingContext, cmp: Composite.Renderable, plane: T.Bounds, extraarguments: T.ExtraShaderArguments)=>void> = [
        (ctx:WebGL2RenderingContext, cmp: Composite.Image, plane: T.Bounds, extraarguments: T.ExtraShaderArguments) => {
          let gl = ctx;

        let funtimes = new Float32Array(
          [cmp.rprops.dstrect.w,0,0,0,
            0,cmp.rprops.dstrect.h,0,0,
            0,0,1,0,
            plane.x, plane.y,0,1]
        )

        funtimes[0]  *=  2/plane.w;
        funtimes[5]  *= -2/plane.h;
        funtimes[12]  =  (funtimes[12]*(2/plane.w))-1;
        funtimes[13]  = -(funtimes[13]*(2/plane.h))+1;

        gl.uniformMatrix4fv(this.matrixLocation, false, funtimes);

        if(this.textureMatrixLocation != null){
          let texMatrix = Matrix.orthographic(-1, 1, 1, -1, -1,1);
          gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
        }
      }
    ]

}