import * as T from "../../_type"
import Shader from "../_shaders"

import Template from "./template"

import Matrix from "./matrices"
import {Composite} from '../composite';


export class Normal extends Template {
  public program : WebGLProgram;
  public name : string = "normal";
  public matrixLocation : WebGLUniformLocation;
  public textureMatrixLocation : WebGLUniformLocation;
  public texture : WebGLUniformLocation;
  
    public second : Array<()=>void> = [
      () => {}]
    public first : Array<(ctx:WebGL2RenderingContext)=>void> = [
      (ctx:WebGL2RenderingContext) => {
        let gl = ctx;
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
      public passes : Array<(ctx:WebGL2RenderingContext, cmp: Composite.Renderable, plane: T.Box)=>void> = [
        (ctx:WebGL2RenderingContext, cmp: Composite.Image, plane: T.Box) => {
          let gl = ctx;
          // gl.activeTexture(gl.TEXTURE0);
          // gl.bindTexture(gl.TEXTURE_2D, cmp.texture);
          // gl.uniform1i(this.texture, 0);
        let normalizedHeight = cmp.rprops.dstrect.h * (-2/plane.h);
        let normalizedWidth  = cmp.rprops.dstrect.w * (2/plane.w);
        let positionMatrix = new Float32Array(
          [ normalizedWidth,0,0,0,
            0,normalizedHeight,0,0,
            0,0,1,0,
            0,0,0,1]
        )
        
        let scaleoffset : T.Point = {x:0,y:0};
        if(cmp.rprops.scalecenter!=undefined){
          scaleoffset = {x:cmp.rprops.scalecenter.x*( 2/plane.w),
                         y:cmp.rprops.scalecenter.y*(-2/plane.h)};
        } 
        scaleoffset = {x:(0 - scaleoffset.x) * cmp.rprops.scale.x + scaleoffset.x,
                       y:normalizedHeight - (normalizedHeight - scaleoffset.y) * cmp.rprops.scale.y - scaleoffset.y}
        
        positionMatrix = Matrix.mat4mul(positionMatrix,Matrix.mat4translation({x:scaleoffset.x,y:scaleoffset.y})) as Float32Array<ArrayBuffer>;
        positionMatrix = Matrix.scale(positionMatrix,cmp.rprops.scale.x,cmp.rprops.scale.y,1) as Float32Array<ArrayBuffer>;
        
        let rotcenter : T.Point = {x:0,y:0};
        if(cmp.rprops.rotcenter!=undefined){
          rotcenter = {x:cmp.rprops.rotcenter.x*(2/plane.w),y:((cmp.rprops.dstrect.h-cmp.rprops.rotcenter.y))*(-2/plane.h)}
        }

        positionMatrix = Matrix.mat4mul(positionMatrix,Matrix.mat4translation({x:-rotcenter.x,y:-rotcenter.y})) as Float32Array<ArrayBuffer>;
        positionMatrix = Matrix.mat4mul(positionMatrix,Matrix.mat4rot(cmp.rprops.angle)) as Float32Array<ArrayBuffer>;
        positionMatrix = Matrix.mat4mul(positionMatrix,Matrix.mat4translation({x:rotcenter.x,y:rotcenter.y})) as Float32Array<ArrayBuffer>;
        
        positionMatrix[12] += Math.round(cmp.rprops.dstrect.x)*(2/plane.w) - 1;
        positionMatrix[13] += -(Math.round(plane.h-cmp.rprops.dstrect.y-cmp.rprops.dstrect.h)*(2/plane.h))+1;

        gl.uniformMatrix4fv(this.matrixLocation, false, positionMatrix);

        
        if(this.textureMatrixLocation != null){
          let texMatrix = Matrix.orthographic(-1, 1, -1,1,  -1,1);
          texMatrix = Matrix.translate(texMatrix,0,1,0);


          if(cmp.rprops.flip.flipx && cmp.rprops.flip.flipy){
            texMatrix = Matrix.orthographic( 1,-1, 1,-1,-1, 1);
            texMatrix = Matrix.translate(texMatrix,-1,0,0);
          } else if(cmp.rprops.flip.flipx){
            texMatrix = Matrix.orthographic( 1,-1,-1, 1,-1, 1);
            texMatrix = Matrix.translate(texMatrix,-1,1,0);
          } else if(cmp.rprops.flip.flipy){
            texMatrix = Matrix.orthographic(-1, 1, 1,-1,-1, 1);
            // texMatrix = Matrix.translate(texMatrix,0,0,0);
          }
          gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
        }
      }
    ]

}