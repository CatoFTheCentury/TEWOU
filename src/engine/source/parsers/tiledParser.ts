/**
 * 
 * Send a 2char string and returns tile position in pics1_dyl.png array
 * 
 * TODO: Links, Signs, NPCs, Chests and Baddies
 * 
 *  */ 

import * as T from "../_type"
import {Render} from "../render/_render"
import {Composite} from "../render/composite"
import Textures from "../render/textures"
import {Assets} from "../render/assets"
import { ShaderLoader } from "../render/shaderloader"

export class Tiled {


  public static blit(glContext: Render.GLContext, shadercontext: ShaderLoader, cellbuild: T.CellBuild, prefix: string) : Array<Composite.Snap> {
    let i: number = -1;


    return  cellbuild.tiles.map(layer => {
        i++;
        console.log(layer);
        const framebuffer : WebGLFramebuffer | null = glContext.gl.createFramebuffer()

        glContext.gl.bindFramebuffer(glContext.gl.FRAMEBUFFER, glContext.framebuffer)

        const cellWidth  =  cellbuild.square.w     * layer.tileYX[0].length;
        const cellHeight =  cellbuild.square.h     * layer.tileYX.length   ;
        const tilesetTW  = (cellbuild.tilesetwidth  / cellbuild.square.w    );
        // const tilesetTH  =  game.assetList.tileset.h  / game.assetList.square    ;

        let cellTex : WebGLTexture = Textures.createTexToBlitOn(glContext, cellWidth, cellHeight);

        glContext.gl.framebufferTexture2D(glContext.gl.FRAMEBUFFER, glContext.gl.COLOR_ATTACHMENT0, glContext.gl.TEXTURE_2D, cellbuild.texture, 0);
        glContext.gl.bindTexture(glContext.gl.TEXTURE_2D, cellTex);
        
        for(let y = 0; y < layer.tileYX.length; y++){
          for(let x = 0; x < layer.tileYX[y].length; x++){
            glContext.gl.copyTexSubImage2D(glContext.gl.TEXTURE_2D, 0,
              x * cellbuild.square.w,
              y * cellbuild.square.h,
              // 0,
              layer.tileYX[y][x] % tilesetTW * cellbuild.square.w,
              Math.floor(layer.tileYX[y][x] / tilesetTW) * cellbuild.square.h, 
              cellbuild.square.w, cellbuild.square.h)
          }
        }
        // console.log(cellTex);
        // glContext.gl.deleteFramebuffer(framebuffer)

        glContext.addTexture(prefix+i, cellTex);
        let a = new Composite.Image(glContext,shadercontext,prefix+i, {x:0,y:0,w:cellWidth,h:cellHeight},{x:0,y:0,w:cellWidth,h:cellHeight});
        let b = new Composite.Snap(glContext,shadercontext,[a]);
        b.rprops.layer = i - cellbuild.playLayer;
        return b;
      }
    );
  }
}
